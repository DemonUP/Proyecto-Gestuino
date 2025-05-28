// controllers/facturaController.js
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import supabase from '../../../supabase';

export function useFacturaController(mesa, navigation) {
  const [pedidos, setPedidos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [propina, setPropina] = useState(0);
  const [ivaTotal, setIvaTotal] = useState(0);
  const [propinaTotal, setPropinaTotal] = useState(0);
  const [totalConPropina, setTotalConPropina] = useState(0);
  const [totalSinPropina, setTotalSinPropina] = useState(0);

  const [cantidadPersonas, setCantidadPersonas] = useState('');
  const [descripcionMesa, setDescripcionMesa] = useState('');
  const [fechaReservacion, setFechaReservacion] = useState('');

  useEffect(() => {
    obtenerPedidos();
    obtenerMesaInfo();
  }, []);

  const obtenerPedidos = async () => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, cantidad, creado_en, productos:producto_id(nombre, precio)')
    .eq('mesa_id', mesa.id)
    .neq('estado', 'facturado');

  if (error) {
    console.error('Error al obtener pedidos:', error);
    return;
  }

  setPedidos(data);

  // ✅ Establecer la fecha de reservación
  if (data.length > 0 && data[0].creado_en) {
    const fecha = new Date(data[0].creado_en);
    setFechaReservacion(
      fecha.toLocaleString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }

    const sub = data.reduce(
      (acc, p) => acc + p.cantidad * p.productos.precio,
      0
    );
    setSubtotal(sub);

    const { data: configData, error: configError } = await supabase
      .from('configuraciones')
      .select('*');

    if (configError) {
      console.error('Error cargando configuración:', configError);
      setTotalSinPropina(sub);
      setTotalConPropina(sub);
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

    const ivaCalc = sub * (ivaPorcentaje / 100);
    const propinaCalc = sub * (propinaPorcentaje / 100);

    setIvaTotal(Math.round(ivaCalc));
    setPropinaTotal(Math.round(propinaCalc));
    setTotalSinPropina(Math.round(sub + ivaCalc));
    setTotalConPropina(Math.round(sub + ivaCalc + propinaCalc));
  };

  const obtenerMesaInfo = async () => {
    const { data, error } = await supabase
      .from('mesas')
      .select('cantidad_personas, descripcion')
      .eq('id', mesa.id)
      .single();

    if (!error && data) {
      setCantidadPersonas(data.cantidad_personas);
      setDescripcionMesa(data.descripcion || '');
    } else {
      console.error('Error al obtener info de mesa:', error);
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
      navigation.navigate('MeseroHome');
    }
  };

  const imprimirFactura = () => {
    console.log(`--- FACTURA MESA ${mesa.numero} ---`);
    console.log(`Cantidad de personas: ${cantidadPersonas}`);
    if (descripcionMesa) {
      console.log(`Descripción: ${descripcionMesa}`);
    }
    pedidos.forEach((p) => {
      console.log(
        `${p.cantidad} x ${p.productos.nombre} = $${p.cantidad * p.productos.precio}`
      );
    });
    console.log(`Subtotal: $${subtotal}`);
    console.log(`IVA (${iva}%) = $${ivaTotal}`);
    console.log(`Propina (${propina}%) = $${propinaTotal}`);
    console.log(`TOTAL SIN PROPINA: $${totalSinPropina}`);
    console.log(`TOTAL CON PROPINA: $${totalConPropina}`);
  };

  return {
    pedidos,
    subtotal,
    iva,
    propina,
    ivaTotal,
    propinaTotal,
    totalConPropina,
    totalSinPropina,
    cerrarCuenta,
    imprimirFactura,
    cantidadPersonas,
    descripcionMesa,    
    fechaReservacion // ✅ este es necesario
  };
}
