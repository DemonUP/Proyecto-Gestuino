import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import supabase from '../../../supabase';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(128, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default function GraficosReportes() {
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [ventasPorAnio, setVentasPorAnio] = useState([]);
  const [ventasPorMesa, setVentasPorMesa] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('cantidad, productos(precio), creado_en, mesa_id');

    if (error) return console.error('Error cargando pedidos', error);

    const { data: configuraciones } = await supabase
      .from('configuraciones')
      .select('*');

    let iva = 0;
    let propina = 0;
    configuraciones.forEach((c) => {
      if (c.nombre === 'iva') iva = parseFloat(c.valor);
      if (c.nombre === 'propina') propina = parseFloat(c.valor);
    });

    const porDia = {};
    const porMes = {};
    const porAnio = {};
    const porMesa = {};

    pedidos.forEach(p => {
      const precio = p.productos?.precio || 0;
      const base = p.cantidad * precio;
      const total = base + base * (iva / 100) + base * (propina / 100);

      const fecha = new Date(p.creado_en);
      const dia = fecha.toLocaleDateString('es-CO', { weekday: 'short' });
      const mes = fecha.toLocaleDateString('es-CO', { month: 'short' });
      const anio = fecha.getFullYear();
      const mesa = `Mesa ${p.mesa_id}`;

      porDia[dia] = (porDia[dia] || 0) + total;
      porMes[mes] = (porMes[mes] || 0) + total;
      porAnio[anio] = (porAnio[anio] || 0) + total;
      porMesa[mesa] = (porMesa[mesa] || 0) + total;
    });

    setVentasPorDia(Object.entries(porDia));
    setVentasPorMes(Object.entries(porMes));
    setVentasPorAnio(Object.entries(porAnio));
    setVentasPorMesa(Object.entries(porMesa));
  };

  const prepararDatos = (datos) => ({
    labels: datos.map(([k]) => k),
    datasets: [{ data: datos.map(([, v]) => v) }],
  });

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ventas por Día</Text>
      <BarChart
        data={prepararDatos(ventasPorDia)}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 15 }}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ventas por Mes</Text>
      <LineChart
        data={prepararDatos(ventasPorMes)}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 15 }}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ventas por Año</Text>
      <BarChart
        data={prepararDatos(ventasPorAnio)}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 15 }}
      />

      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mesas que Más Venden</Text>
      <PieChart
        data={ventasPorMesa.map(([mesa, valor], i) => ({
          name: mesa,
          population: valor,
          color: ['tomato', 'orange', 'gold', 'brown', 'gray'][i % 5],
          legendFontColor: '#000',
          legendFontSize: 12,
        }))}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        style={{ marginVertical: 15 }}
      />
    </ScrollView>
  );
}
