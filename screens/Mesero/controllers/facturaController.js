import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import supabase from '../../../supabase';

export function useFacturaController(mesa, navigation) {
  const [pedidos, setPedidos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [propina, setPropina] = useState(0);

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
      return;
    }

    setPedidos(data);

    const sub = data.reduce(
      (acc, p) => acc + p.cantidad * p.productos.precio,
      0
    );

    setSubtotal(sub);

    // Cargar IVA y propina desde configuraciones
    const { data: configData, error: configError } = await supabase
      .from('configuraciones')
      .select('*');

    if (configError) {
      console.error('Error cargando configuración:', configError);
      setTotal(sub); // fallback solo subtotal
      return;
    }

    let ivaPorcentaje = 0;
    let propinaPorcentaje = 0;

    configData.forEach((cfg) => {
      if (cfg.nombre === 'iva') ivaPorcentaje = parseFloat(cfg.valor);
      if (cfg.nombre === 'propina') propinaPorcentaje = parseFloat(cfg.valor);
    });

    setIva(ivaPorcentaje);
    setPropina(propinaPorcentaje);

    const calculado =
      sub +
      (sub * ivaPorcentaje) / 100 +
      (sub * propinaPorcentaje) / 100;

    setTotal(Math.round(calculado));
  };

  const cerrarCuenta = async (incluirPropina = false) => {
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
      navigation.navigate('MeseroHome');
    }
  };

  const imprimirFactura = () => {
    console.log(`--- FACTURA MESA ${mesa.numero} ---`);
    pedidos.forEach((p) => {
      console.log(
        `${p.cantidad} x ${p.productos.nombre} = $${p.cantidad * p.productos.precio}`
      );
    });
    console.log(`Subtotal: $${subtotal}`);
    console.log(`IVA (${iva}%) = $${(subtotal * iva / 100).toFixed(2)}`);
    console.log(`Propina (${propina}%) = $${(subtotal * propina / 100).toFixed(2)}`);
    console.log(`TOTAL: $${total}`);
  };

  return {
    pedidos,
    subtotal,
    iva,
    propina,
    total,
    cerrarCuenta,
    imprimirFactura,
  };
}
