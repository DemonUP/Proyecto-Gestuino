import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from '../styles/ReportesStyle';
import useReportesController from '../controllers/ReportesController';

export default function ReportesScreen() {
  const navigation = useNavigation();
  const {
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
  } = useReportesController();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.titulo}>Reporte de Ventas</Text>
          <Text style={styles.totalGeneral}>TOTAL: ${totalGeneral.toFixed(2)}</Text>
          <Text style={styles.subInfo}>IVA cobrado: ${ivaTotal.toFixed(2)}</Text>
          <Text style={styles.subInfo}>Propina cobrada: ${propinaTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.botonesTop}>
          <TouchableOpacity
            style={styles.botonCuadrado}
            onPress={() => navigation.navigate('GraficosReportes')}
          >
            <Ionicons name="bar-chart-outline" style={styles.iconoBoton} />
          </TouchableOpacity>

          {(fechaInicio || fechaFin) && (
            <TouchableOpacity style={styles.botonCuadrado} onPress={limpiarFiltros}>
              <Ionicons name="close-outline" style={styles.iconoBoton} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.botonCuadrado}
            onPress={() => setMostrarFiltros(prev => !prev)}
          >
            <Ionicons name="calendar-outline" style={styles.iconoBoton} />
          </TouchableOpacity>
        </View>
      </View>

      {mostrarFiltros && Platform.OS === 'web' && (
        <View style={styles.filtroPopup}>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => {
              setFechaInicio(date);
              if (fechaFin) setMostrarFiltros(false);
            }}
            selectsStart
            startDate={fechaInicio}
            endDate={fechaFin}
            dateFormat="yyyy-MM-dd"
            placeholderText="Desde"
          />
          <DatePicker
            selected={fechaFin}
            onChange={(date) => {
              setFechaFin(date);
              if (fechaInicio) setMostrarFiltros(false);
            }}
            selectsEnd
            startDate={fechaInicio}
            endDate={fechaFin}
            minDate={fechaInicio}
            dateFormat="yyyy-MM-dd"
            placeholderText="Hasta"
          />
        </View>
      )}

      {Object.entries(ventasPorMesa).map(([mesaId, grupo]) => (
        <View key={mesaId} style={styles.cardMesa}>
          <TouchableOpacity onPress={() => toggleMesa(mesaId)} style={styles.mesaHeader}>
            <Ionicons name="restaurant-outline" size={18} color="brown" />
            <Text style={styles.mesaTitulo}>{grupo.nombreMesa}</Text>
            <Text style={styles.totalMesa}>Total: ${grupo.totalMesa.toFixed(2)}</Text>
          </TouchableOpacity>

          {mesasAbiertas[mesaId] &&
            Object.values(grupo.ventasAgrupadas).map((venta, idx) => (
              <View key={idx} style={styles.ventaItem}>
                <Text>
                  {venta.cantidad} x {venta.nombreProducto} — ${venta.precio}
                </Text>
                <Text>Mesero: {venta.mesero}</Text>
                <Text>Fecha: {venta.fecha}</Text>
                <Text style={styles.total}>Total: ${(venta.cantidad * venta.precio).toFixed(2)}</Text>
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}
