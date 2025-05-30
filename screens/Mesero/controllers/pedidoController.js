import { useEffect, useState } from 'react';
import { Alert, ToastAndroid, Platform } from 'react-native';
import supabase, { obtenerUsuarioDeSesion } from '../../../supabase';
import { verificarDisponibilidad, descontarIngredientes } from '../../Admin/controllers/InventarioController';
import styles, { webToastStyle } from '../styles/pedidoStyles';

export function usePedidoController(navigation) {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState('disponible');
  const [usuario, setUsuario] = useState(null);

  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [pedidosExistentes, setPedidosExistentes] = useState([]);

  const [cantidadPersonas, setCantidadPersonas] = useState('');
  const [descripcionMesa, setDescripcionMesa] = useState('');

  const mostrarToast = (mensaje) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(mensaje, ToastAndroid.LONG);
  } else {
    const toast = document.createElement('div');
    toast.textContent = mensaje;

    if (webToastStyle && typeof webToastStyle === 'object') {
      Object.entries(webToastStyle).forEach(([key, value]) => {
        toast.style[key] = value;
      });
    } else {
      // Estilo por defecto si no existe webToastStyle
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.padding = '12px 24px';
      toast.style.background = '#333';
      toast.style.color = 'white';
      toast.style.borderRadius = '6px';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.zIndex = '9999';
    }

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
      setCantidadPersonas(mesa?.cantidad_personas?.toString() || '');
      setDescripcionMesa(mesa?.descripcion || '');
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
      .eq('activo', true);
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
  console.log("🛠️ Ejecutando actualización de estado...");
  console.log("ℹ️ ID de mesa seleccionada:", mesaSeleccionada);
  console.log("ℹ️ Nuevo estado:", estadoMesa);

  if (!mesaSeleccionada) {
    mostrarToast('Debes seleccionar una mesa.');
    return;
  }

  const { data, error } = await supabase
    .from('mesas')
    .update({ estado: estadoMesa }) // ✅ solo se actualiza el estado
    .eq('id', mesaSeleccionada)
    .select();

  if (error) {
    console.error('❌ Error actualizando estado:', error);
    Alert.alert('Error', 'No se pudo actualizar el estado de la mesa.');
  } else if (!data || data.length === 0) {
    console.warn('⚠️ No se actualizó ninguna fila. ¿ID correcto?');
    Alert.alert('Atención', 'No se actualizó la mesa. Revisa el ID.');
  } else {
    console.log("✅ Estado actualizado correctamente:", data);
    mostrarToast(`✅ Estado de la mesa actualizado a "${estadoMesa}"`);
    obtenerMesas();
  }
};





  const enviarPedido = async () => {
  if (!mesaSeleccionada || pedido.length === 0) {
    mostrarToast('Selecciona una mesa y productos.');
    return;
  }

  if (!cantidadPersonas || isNaN(parseInt(cantidadPersonas))) {
    mostrarToast('Debes ingresar una cantidad de personas válida.');
    return;
  }

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
    return;
  }

  for (const [id, cantidad] of Object.entries(grouped)) {
    await descontarIngredientes(parseInt(id), cantidad);
  }

  // Si la mesa está disponible, actualiza su estado + info extra
  if (estadoMesa === 'disponible') {
    await supabase
      .from('mesas')
      .update({
        estado: 'ocupada',
        cantidad_personas: parseInt(cantidadPersonas),
        descripcion: descripcionMesa || null,
        usuario_id: usuario?.id, // 👈 asignamos el mesero actual
      })
      .eq('id', mesaSeleccionada);
  }


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
    mesas,
    mesaSeleccionada,
    setMesaSeleccionada,
    estadoMesa,
    setEstadoMesa,
    productos,
    pedido,
    pedidosExistentes,
    agregarProducto,
    eliminarProductoSeleccionado,
    eliminarProductoPorCantidad,
    eliminarPedidoExistente,
    actualizarEstadoMesa,
    enviarPedido,
    cantidadPersonas,
    setCantidadPersonas,
    descripcionMesa,
    setDescripcionMesa,
  };
}
