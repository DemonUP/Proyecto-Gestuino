import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import AdminSidebar from '../../../components/AdminSidebar';
import styles from '../styles/ReportesStyle';
import useReportesController from '../controllers/ReportesController';

const MOBILE_BREAKPOINT = 700;

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

  // Responsive: detectar móvil
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);
  const isMobile = layoutWidth < MOBILE_BREAKPOINT;

  useEffect(() => {
    const onChange = ({ window }) => setLayoutWidth(window.width);
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  const now = new Date();
  const monthName = now
    .toLocaleString('es-ES', { month: 'long' })
    .replace(/^./, s => s.toUpperCase());
  const year = now.getFullYear();

  const formatCurrency = value =>
    new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // NUEVO: ancho dinámico para cada highlightCard
  const highlightCount = 3;
  const highlightCardStyle = isMobile
    ? [styles.highlightCard, styles.highlightCardMobile]
    : [styles.highlightCard, { width: `${100 / highlightCount}%`, minWidth: 220, maxWidth: 400, flex: 1 }];

  return (
    <View style={[styles.wrapper, isMobile && styles.wrapperMobile]}>
      <AdminSidebar
        navigation={navigation}
        activeRoute="Reportes"
        onLogout={() => navigation.navigate('Login')}
      />

      <ScrollView
        style={[styles.mainContent, isMobile && styles.mainContentMobile]}
        contentContainerStyle={[styles.container, isMobile && styles.containerMobile]}
      >
        {/* ─── Header principal ─── */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}>Reporte Financiero</Text>
            <Text style={[styles.pageSubtitle, isMobile && styles.pageSubtitleMobile]}>
              Período: {monthName} {year} | Moneda: COL
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.botonCuadrado}
              onPress={() => setMostrarFiltros(prev => !prev)}
            >
              <Ionicons name="calendar-outline" style={styles.iconoBoton} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonCuadrado}
              onPress={() => navigation.navigate('GraficosReportes')}
            >
              <Ionicons name="bar-chart-outline" style={styles.iconoBoton} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Filtros por fecha ─── */}
        {mostrarFiltros && Platform.OS === 'web' && (
          <View style={styles.filtrosContainer}>
            <Text style={styles.label}>Fecha de inicio</Text>
            <DatePicker
              selected={fechaInicio}
              onChange={setFechaInicio}
              dateFormat="yyyy-MM-dd"
              className="datepicker"
              placeholderText="Selecciona una fecha"
            />
            <Text style={styles.label}>Fecha de fin</Text>
            <DatePicker
              selected={fechaFin}
              onChange={setFechaFin}
              dateFormat="yyyy-MM-dd"
              className="datepicker"
              placeholderText="Selecciona una fecha"
            />
            <TouchableOpacity onPress={limpiarFiltros} style={styles.botonLimpiar}>
              <Text style={styles.textoBotonLimpiar}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── Tarjetas destacadas ─── */}
        <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
          <View style={highlightCardStyle}>
            <View style={styles.highlightHeader}>
              <Text style={styles.titulo}>TOTAL GENERAL</Text>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="cash-outline" size={20} color="#FF6B35" />
              </View>
            </View>
            <Text style={styles.highlightText}>
              ${formatCurrency(totalGeneral)}
            </Text>
          </View>

          <View style={highlightCardStyle}>
            <View style={styles.highlightHeader}>
              <Text style={styles.titulo}>IVA COBRADO</Text>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="receipt-outline" size={20} color="#FF6B35" />
              </View>
            </View>
            <Text style={styles.highlightText}>
              ${formatCurrency(ivaTotal)}
            </Text>
            <Text style={styles.highlightSubtext}>
              {((ivaTotal / totalGeneral) * 100).toFixed(1)}% del total
            </Text>
          </View>

          <View style={highlightCardStyle}>
            <View style={styles.highlightHeader}>
              <Text style={styles.titulo}>PROPINA COBRADA</Text>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="stats-chart-outline" size={20} color="#FF6B35" />
              </View>
            </View>
            <Text style={styles.highlightText}>
              ${formatCurrency(propinaTotal)}
            </Text>
          </View>
        </View>

        {/* ─── Desglose por mesa ─── */}
        {Object.entries(ventasPorMesa).map(([mesaId, grupo]) => (
          <View key={mesaId}>
            <View style={styles.mesaRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.mesaBadge}>{grupo.nombreMesa}</Text>
                <Text style={{ fontWeight: '600', color: '#333' }}>
                  Total: ${formatCurrency(grupo.totalMesa)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => toggleMesa(mesaId)}>
                <Ionicons
                  name={mesasAbiertas[mesaId] ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#B22222"
                />
              </TouchableOpacity>
            </View>

            {mesasAbiertas[mesaId] &&
              Object.values(grupo.ventasAgrupadas).map((venta, idx) => (
                <View key={idx} style={styles.ventaRow}>
                  <Text style={styles.ventaTexto}>
                    {venta.cantidad} x {venta.nombreProducto} — $
                    {formatCurrency(venta.precio)}
                  </Text>
                  <Text style={styles.ventaTexto}>
                    Mesero: {venta.mesero}
                  </Text>
                  <Text style={styles.ventaTexto}>Fecha: {venta.fecha}</Text>
                  <Text style={styles.ventaTotal}>
                    Total: ${formatCurrency(venta.cantidad * venta.precio)}
                  </Text>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
