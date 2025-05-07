// controllers/useReportesController.js
import { useEffect, useState } from 'react';
import supabase from '../../../supabase';

export default function useReportesController() {
  const [ventasPorMesa, setVentasPorMesa] = useState({});
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [mesasAbiertas, setMesasAbiertas] = useState({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    cargarVentasAgrupadas();
  }, [fechaInicio, fechaFin]);

  const cargarVentasAgrupadas = async () => {
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
      `);

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
    let total = 0;

    data.forEach((venta) => {
      const mesaId = venta.mesas?.id;
      const nombreMesa = `Mesa ${venta.mesas?.numero || '?'}`;
      const mesero = venta.usuarios
        ? `${venta.usuarios.nombre} ${venta.usuarios.apellido}`
        : 'Desconocido';
      const fecha = new Date(venta.creado_en).toLocaleDateString();
      const key = `${venta.productos.nombre}-${venta.productos.precio}-${mesero}-${fecha}`;
      const totalVenta = venta.cantidad * venta.productos.precio;
      total += totalVenta;

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

    setVentasPorMesa(agrupadas);
    setTotalGeneral(total);
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
