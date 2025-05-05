import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import supabase from '../../../supabase';

export function useFacturaController(mesa, navigation) {
  const [pedidos, setPedidos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, cantidad, productos:producto_id(nombre, precio)')
      .eq('mesa_id', mesa.id)
      .neq('estado', 'facturado');

    if (error) {
      console.error('Error al obtener pedidos:', error);
    } else {
      setPedidos(data);
      const totalCalculado = data.reduce(
        (acc, p) => acc + p.cantidad * p.productos.precio,
        0
      );
      setTotal(totalCalculado);
    }
  };

  const cerrarCuenta = async () => {
    const { error: pedidoError } = await supabase
      .from('pedidos')
      .update({ estado: 'facturado' })
      .eq('mesa_id', mesa.id)
      .neq('estado', 'facturado');

    const { error: mesaError } = await supabase
      .from('mesas')
      .update({ estado: 'disponible' })
      .eq('id', mesa.id);

    if (pedidoError || mesaError) {
      Alert.alert('Error', 'No se pudo cerrar la cuenta.');
    } else {
      Alert.alert('Cuenta cerrada', 'La mesa ha sido liberada.');
      navigation.goBack();
    }
  };

  const imprimirFactura = () => {
    console.log(`--- FACTURA MESA ${mesa.numero} ---`);
    pedidos.forEach((p) => {
      console.log(`${p.cantidad} x ${p.productos.nombre} = $${p.cantidad * p.productos.precio}`);
    });
    console.log(`TOTAL: $${total}`);
    Alert.alert('Factura generada', 'Verifica la consola para la impresión simulada.');
  };

  return {
    pedidos,
    total,
    cerrarCuenta,
    imprimirFactura
  };
}
