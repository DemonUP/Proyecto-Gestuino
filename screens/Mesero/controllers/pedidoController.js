import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import supabase from '../../../supabase';
import { obtenerUsuarioDeSesion } from '../../../supabase';


export function usePedidoController(navigation) {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState('disponible');
  const [usuario, setUsuario] = useState(null);


  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [pedidosExistentes, setPedidosExistentes] = useState([]);

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
    const { data, error } = await supabase.from('productos').select('*');
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
      Alert.alert('Error', 'Selecciona una mesa y productos.');
      return;
    }

    if (estadoMesa === 'disponible') {
      await supabase
        .from('mesas')
        .update({ estado: 'ocupada' })
        .eq('id', mesaSeleccionada);
    }

    const inserts = pedido.map((producto) => ({
      mesa_id: mesaSeleccionada,
      producto_id: producto.id,
      cantidad: 1,
      estado: 'pendiente',
      usuario_id: usuario.id,
    }));

    const { error } = await supabase.from('pedidos').insert(inserts);

    if (error) {
      console.error('Error al enviar pedido:', error);
      Alert.alert('Error', 'No se pudo guardar el pedido.');
    } else {
      Alert.alert('Pedido guardado', 'Se guardó el pedido correctamente.');
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
