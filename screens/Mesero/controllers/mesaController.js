import { useEffect, useState } from 'react';
import supabase from '../../../supabase';

export function useMesaController() {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    const { data, error } = await supabase.from('mesas').select('*');
    if (!error) setMesas(data);
    else console.error('Error al obtener mesas:', error);
  };

  const abrirMesa = async (mesa) => {
    setMesaSeleccionada(mesa);
    setModalVisible(true);
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, cantidad, estado, productos:producto_id(nombre, precio)')
      .eq('mesa_id', mesa.id)
      .neq('estado', 'facturado');

    if (!error) {
      setPedidos(data);
      const totalCalculado = data.reduce((acc, p) => acc + p.cantidad * p.productos.precio, 0);
      setTotal(totalCalculado);
    } else {
      console.error('Error al obtener pedidos:', error);
      setPedidos([]);
      setTotal(0);
    }
  };

  return {
    mesas,
    mesaSeleccionada,
    pedidos,
    total,
    modalVisible,
    abrirMesa,
    setModalVisible
  };
}
