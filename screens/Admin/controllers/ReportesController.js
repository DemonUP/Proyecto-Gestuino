import { useEffect, useState } from 'react';
import supabase from '../../../supabase';

export default function useReportesController() {
  const [ventasPorMesa, setVentasPorMesa] = useState({});
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [ivaTotal, setIvaTotal] = useState(0);
  const [propinaTotal, setPropinaTotal] = useState(0);
  const [mesasAbiertas, setMesasAbiertas] = useState({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    cargarVentasAgrupadas();
  }, [fechaInicio, fechaFin]);

  const cargarVentasAgrupadas = async () => {
    // 1. Cargar IVA y propina
    const { data: config, error: configError } = await supabase
      .from('configuraciones')
      .select('*');

    if (configError) {
      console.error('Error cargando configuraciones:', configError);
      return;
    }

    const iva = parseFloat(config.find(c => c.nombre === 'iva')?.valor || 0);
    const propina = parseFloat(config.find(c => c.nombre === 'propina')?.valor || 0);

    // 2. Consulta de ventas
    let query = supabase
      .from('pedidos')
      .select(`
        id,
        cantidad,
        estado,
        creado_en,
        mesas(id, numero),
        productos(id, nombre, precio),
        usuarios(id, nombre, apellido)
      `)
      .eq('estado', 'facturado'); // Solo ventas cerradas

    if (fechaInicio) {
      query = query.gte('creado_en', fechaInicio.toISOString());
    }
    if (fechaFin) {
      const finDelDia = new Date(fechaFin);
      finDelDia.setHours(23, 59, 59, 999);
      query = query.lte('creado_en', finDelDia.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al cargar ventas:', error);
      return;
    }

    const agrupadas = {};
    let subtotal = 0;

    data.forEach((venta) => {
      const mesaId = venta.mesas?.id;
      const nombreMesa = `Mesa ${venta.mesas?.numero || '?'}`;
      const mesero = venta.usuarios
        ? `${venta.usuarios.nombre} ${venta.usuarios.apellido}`
        : 'Desconocido';
      const fecha = new Date(venta.creado_en).toLocaleDateString();
      const key = `${venta.productos.nombre}-${venta.productos.precio}-${mesero}-${fecha}`;
      const totalVenta = venta.cantidad * venta.productos.precio;
      subtotal += totalVenta;

      if (!agrupadas[mesaId]) {
        agrupadas[mesaId] = {
          nombreMesa,
          totalMesa: 0,
          ventasAgrupadas: {},
        };
      }

      if (!agrupadas[mesaId].ventasAgrupadas[key]) {
        agrupadas[mesaId].ventasAgrupadas[key] = {
          nombreProducto: venta.productos.nombre,
          precio: venta.productos.precio,
          cantidad: 0,
          mesero,
          fecha,
        };
      }

      agrupadas[mesaId].ventasAgrupadas[key].cantidad += venta.cantidad;
      agrupadas[mesaId].totalMesa += totalVenta;
    });

    // 3. Cálculos de impuestos
    const ivaMonto = subtotal * (iva / 100);
    const propinaMonto = subtotal * (propina / 100);
    const totalFinal = subtotal + ivaMonto + propinaMonto;

    setVentasPorMesa(agrupadas);
    setTotalGeneral(totalFinal);
    setIvaTotal(ivaMonto);
    setPropinaTotal(propinaMonto);
  };

  const toggleMesa = (id) => {
    setMesasAbiertas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const limpiarFiltros = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setMostrarFiltros(false);
  };

  return {
    ventasPorMesa,
    totalGeneral,
    ivaTotal,
    propinaTotal,
    mesasAbiertas,
    toggleMesa,
    mostrarFiltros,
    setMostrarFiltros,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    limpiarFiltros,
  };
}
