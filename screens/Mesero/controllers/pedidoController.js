import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ToastAndroid, Platform } from 'react-native';
import supabase from '../../../supabase';
import { obtenerUsuarioDeSesion } from '../../../supabase';
import { verificarDisponibilidad, descontarIngredientes } from '../../Admin/controllers/InventarioController';
import styles, { webToastStyle } from '../styles/pedidoStyles'; // 👈 asegúrate que esto esté al inicio del archivo

export function usePedidoController(navigation) {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState('disponible');
  const [usuario, setUsuario] = useState(null);


  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [pedidosExistentes, setPedidosExistentes] = useState([]);

  const mostrarToast = (mensaje) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(mensaje, ToastAndroid.LONG);
      } else {
        const toast = document.createElement('div');
        toast.textContent = mensaje;
    
        // aplicar estilos desde webToastStyle
        Object.entries(webToastStyle).forEach(([key, value]) => {
          toast.style[key] = value;
        });
    
        document.body.appendChild(toast);
        setTimeout(() => (toast.style.opacity = '1'), 10);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
      }
    };
  
  

  useEffect(() => {
    const cargarUsuario = async () => {
      const u = await obtenerUsuarioDeSesion();
      setUsuario(u);
    };
    cargarUsuario();
  }, []);


  useEffect(() => {
    obtenerMesas();
    obtenerProductos();
  }, []);

  useEffect(() => {
    if (mesaSeleccionada) {
      const mesa = mesas.find((m) => m.id === mesaSeleccionada);
      setEstadoMesa(mesa?.estado || 'disponible');
      obtenerPedidosMesa(mesaSeleccionada);
    } else {
      setPedidosExistentes([]);
    }
  }, [mesaSeleccionada]);

  const obtenerMesas = async () => {
    const { data, error } = await supabase.from('mesas').select('*');
    if (!error) setMesas(data);
    else console.error('Error mesas:', error);
  };

  const obtenerProductos = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true); // ✅ Solo productos activos
  
    if (!error) setProductos(data);
    else console.error('Error productos:', error);
  };
  
  const obtenerPedidosMesa = async (idMesa) => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, cantidad, productos:producto_id(nombre, precio)')
      .eq('mesa_id', idMesa)
      .neq('estado', 'facturado');

    if (!error) setPedidosExistentes(data);
    else console.error('Error al obtener pedidos:', error);
  };

  const eliminarPedidoExistente = async (idPedido) => {
    const { error } = await supabase.from('pedidos').delete().eq('id', idPedido);
    if (!error) obtenerPedidosMesa(mesaSeleccionada);
    else console.error('Error al eliminar pedido:', error);
  };

  const eliminarProductoSeleccionado = (index) => {
    const nuevoPedido = [...pedido];
    nuevoPedido.splice(index, 1);
    setPedido(nuevoPedido);
  };

  // ✅ NUEVA FUNCIÓN: Elimina una cantidad específica de un producto
  const eliminarProductoPorCantidad = (productoId, cantidadEliminar) => {
    setPedido((prev) => {
      const nuevaLista = [];
      let eliminados = 0;

      for (let item of prev) {
        if (item.id === productoId && eliminados < cantidadEliminar) {
          eliminados++;
          continue;
        }
        nuevaLista.push(item);
      }

      return nuevaLista;
    });
  };

  const agregarProducto = (producto) => {
    setPedido([...pedido, producto]);
  };

  const actualizarEstadoMesa = async () => {
    if (!mesaSeleccionada) return;
    const { error } = await supabase
      .from('mesas')
      .update({ estado: estadoMesa })
      .eq('id', mesaSeleccionada);

    if (error) {
      console.error('Error cambiando estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    } else {
      Alert.alert('Estado actualizado', `Mesa ahora está "${estadoMesa}".`);
      obtenerMesas();
    }
  };

 const enviarPedido = async () => {
  if (!mesaSeleccionada || pedido.length === 0) {
    mostrarToast('Selecciona una mesa y productos.');
    return;
  }

  // Agrupar productos por ID para obtener la cantidad total de cada uno
  const grouped = {};
  pedido.forEach((p) => {
    grouped[p.id] = (grouped[p.id] || 0) + 1;
  });

  const productosConFaltantes = [];

  for (const [id, cantidad] of Object.entries(grouped)) {
    const resultado = await verificarDisponibilidad(parseInt(id), cantidad);
    if (!resultado.disponible) {
      const producto = productos.find(p => p.id === parseInt(id));
      const nombre = producto?.nombre || `Producto ID ${id}`;
      if (!productosConFaltantes.includes(nombre)) {
        productosConFaltantes.push(nombre);
      }
    }
  }

  if (productosConFaltantes.length > 0) {
    mostrarToast(`Faltan ingredientes para: ${productosConFaltantes.join(', ')}`);
    return; // no continuar si hay faltantes
  }

  // Descontar ingredientes para cada producto según cantidad
  for (const [id, cantidad] of Object.entries(grouped)) {
    await descontarIngredientes(parseInt(id), cantidad);
  }

  // Si la mesa está disponible, actualizarla a "ocupada"
  if (estadoMesa === 'disponible') {
    await supabase.from('mesas').update({ estado: 'ocupada' }).eq('id', mesaSeleccionada);
  }

  // Crear los inserts (una fila por unidad pedida)
  const inserts = [];
  for (const [id, cantidad] of Object.entries(grouped)) {
    for (let i = 0; i < cantidad; i++) {
      inserts.push({
        mesa_id: mesaSeleccionada,
        producto_id: parseInt(id),
        cantidad: 1,
        estado: 'pendiente',
        usuario_id: usuario.id,
      });
    }
  }

  const { error } = await supabase.from('pedidos').insert(inserts);

  if (error) {
    mostrarToast('Error al guardar el pedido.');
  } else {
    mostrarToast('Pedido guardado correctamente.');
    setPedido([]);
    obtenerPedidosMesa(mesaSeleccionada);
    navigation.navigate('Mesas');
  }
};

  return {
    mesas, mesaSeleccionada, setMesaSeleccionada,
    estadoMesa, setEstadoMesa, productos,
    pedido, pedidosExistentes,
    agregarProducto, eliminarProductoSeleccionado,
    eliminarProductoPorCantidad, eliminarPedidoExistente,
    actualizarEstadoMesa, enviarPedido
  };
}
