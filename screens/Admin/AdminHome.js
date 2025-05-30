import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import AdminSidebar from '../../components/AdminSidebar';
import styles from './styles/AdminHomeStyles';
import {
  obtenerVentasHoy,
  obtenerOcupacionMesas,
  obtenerInventarioCritico,
  obtenerVentasPorHora
} from '../../supabase'; // Ajusta la ruta si tu archivo API está en otro lugar

const MOBILE_BREAKPOINT = 700;
const SIDEBAR_WIDTH = 280;

export default function AdminHome({ usuario, navigation, onLogout }) {
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);
  const [numColumns, setNumColumns] = useState(getColumns(layoutWidth));
  const [metricas, setMetricas] = useState(null);

  // Nuevo: detectar si es móvil
  const isMobile = layoutWidth < MOBILE_BREAKPOINT;

  useEffect(() => {
    const onChange = ({ window }) => {
      setLayoutWidth(window.width);
      setNumColumns(getColumns(window.width));
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    const cargarMetricas = async () => {
      const [ventas, ocupacion, inventario] = await Promise.all([
        obtenerVentasHoy(),
        obtenerOcupacionMesas(),
        obtenerInventarioCritico(),
      ]);

      const porcentajeOcupacion = ocupacion.total > 0
        ? ocupacion.ocupadas / ocupacion.total
        : 0;

      setMetricas([
        {
          key: 'ventas',
          title: 'Ventas Hoy',
          value: `$${ventas.toFixed(0)}`,
          subtitle: '+18% vs ayer',
          progress: ventas / 3000,
          Icon: 'cash-outline',
        },
        {
          key: 'ocupacion',
          title: 'Ocupación',
          value: `${Math.round(porcentajeOcupacion * 100)}%`,
          subtitle: `${ocupacion.ocupadas}/${ocupacion.total} mesas`,
          progress: porcentajeOcupacion,
          Icon: 'clipboard-outline',
        },
        {
          key: 'inventario',
          title: 'Inventario Crítico',
          value: `${inventario.length} items`,
          tags: inventario.map(i => i.nombre),
          progress: 0,
          Icon: 'cube-outline',
        },
      ]);
    };

    cargarMetricas();
  }, []);

  // Cambios aquí: todo el layout se adapta según isMobile
  const PADDING = isMobile ? 8 : 16;
  const GAP = isMobile ? 8 : 16;
  const contentWidth = isMobile ? layoutWidth : layoutWidth - SIDEBAR_WIDTH;
  const metricCount = metricas ? metricas.length : 1;
  const usedColumns = isMobile ? 1 : Math.min(numColumns, metricCount);

  const CARD_WIDTH =
    usedColumns > 1
      ? (contentWidth - PADDING * 2 - GAP * (usedColumns - 1)) / usedColumns
      : contentWidth - PADDING * 2;


  return (
    <View style={[styles.wrapper, isMobile && styles.wrapperMobile]}>
      <AdminSidebar navigation={navigation} activeRoute="AdminHome" />
      <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
        <ScrollView contentContainerStyle={[styles.container, { padding: PADDING }]}>
          {/* Header */}
            <View style={[styles.header, isMobile && styles.headerMobile]}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.title,
                    isMobile && styles.titleMobile
                  ]}
                  numberOfLines={isMobile ? 2 : undefined}
                  ellipsizeMode={isMobile ? "tail" : undefined}
                >
                  ¡Bienvenido,{' '}
                  <Text style={styles.highlight}>
                    Administrador/a {usuario.nombre} {usuario.apellido}!
                  </Text>
                </Text>
                <Text style={[
                  styles.status,
                  isMobile && styles.statusMobile
                ]}>
                  Recuerda lo valioso que eres para nuestra empresa.
                </Text>
                {/* Solo en móvil: botón debajo */}
                {isMobile && (
                  <TouchableOpacity
                    style={[styles.logoutButton, styles.logoutButtonMobile]}
                    onPress={onLogout}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    <Ionicons name="log-out-outline" size={20} color="#4B5563" />
                  </TouchableOpacity>
                )}
              </View>
              {/* Solo escritorio: botón a la derecha */}
              {!isMobile && (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={onLogout}
                  activeOpacity={0.8}
                >
                  <Text style={styles.logoutText}>Cerrar Sesión</Text>
                  <Ionicons name="log-out-outline" size={20} color="#4B5563" />
                </TouchableOpacity>
              )}
            </View>


          {/* Métricas */}
          <View style={[styles.metricsGrid, { marginBottom: PADDING }]}>
            {metricas && metricas.map((m, i) => (
              <MetricCard
                key={m.key}
                data={m}
                width={CARD_WIDTH}
                gap={GAP}
                isLastInRow={((i + 1) % usedColumns) === 0}
              />
            ))}
          </View>


          {/* Gráfico de tendencia */}
          <View style={styles.bottomSection}>
            <TrendCard isMobile={isMobile} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Breakpoints para columnas responsivas
function getColumns(width) {
  if (width >= 1024) return 4;
  if (width >= 768) return 2;
  return 1;
}

// Color dinámico según porcentaje de ocupación
function getOcupacionColor(porcentaje) {
  if (porcentaje >= 0.75) return '#16a34a'; // verde
  if (porcentaje >= 0.5) return '#facc15';  // amarillo
  return '#ef4444';                         // rojo
}

function MetricCard({ data, width, gap, isLastInRow }) {
  const { title, value, subtitle, progress, tags, Icon, key } = data;
  const anim = useRef(new Animated.Value(0)).current;
  const borderColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['transparent', '#FF6B35'] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });

  const handleHoverIn = () =>
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  const handleHoverOut = () =>
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start();

  return (
    <Pressable
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={{ marginRight: isLastInRow ? 0 : gap, marginBottom: gap }}
    >
      <Animated.View
        style={[
          styles.metricCard,
          { width, borderBottomColor: borderColor, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.metricHeader}>
          <View>
            <Text style={styles.metricLabel}>{title}</Text>
            <Text style={styles.metricValue}>{value}</Text>
          </View>
          <Ionicons name={Icon} size={20} color="#FF6B35" />
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: key === 'ocupacion'
                  ? getOcupacionColor(progress)
                  : '#FF6B35',
              },
            ]}
          />
        </View>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
        {tags && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function TrendCard({ isMobile }) {
  const [ventas, setVentas] = useState([]);
  const layoutWidth = Dimensions.get('window').width;

  // Si es móvil, cada gráfico ocupa todo el ancho; si no, en columnas
  const chartWidth = isMobile
    ? layoutWidth - 24 // padding lateral
    : (layoutWidth - 320 - 48) / 3;

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerVentasPorHora();
      setVentas(data);
    };
    cargar();
  }, []);

  const horas = ventas.map(v => v.hora);
  const valores = ventas.map(v => v.total);

  const pieData = ventas.map((v, i) => ({
    name: v.hora,
    population: v.total,
    color: ['#FF6B35', '#FFA500', '#4B5563', '#16a34a', '#facc15', '#7e22ce', '#ef4444'][i % 7],
    legendFontColor: '#4B5563',
    legendFontSize: 10,
  }));

  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>Tendencia de Ventas</Text>
      </View>
      {ventas.length === 0 ? (
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>Sin ventas hoy</Text>
      ) : (
        <View style={{
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between'
        }}>
          {/* Barras */}
          <View style={{ width: chartWidth, marginBottom: isMobile ? 16 : 0 }}>
            <Text style={styles.chartTitle}>Barras</Text>
            <BarChart
              data={{
                labels: horas,
                datasets: [{ data: valores }],
              }}
              width={chartWidth}
              height={180}
              yAxisLabel="$"
              chartConfig={chartConfig}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
          {/* Línea */}
          <View style={{ width: chartWidth, marginBottom: isMobile ? 16 : 0 }}>
            <Text style={styles.chartTitle}>Línea</Text>
            <LineChart
              data={{
                labels: horas,
                datasets: [{ data: valores }],
              }}
              width={chartWidth}
              height={180}
              yAxisLabel="$"
              chartConfig={chartConfig}
              bezier
              fromZero
            />
          </View>
          {/* Pastel */}
          <View style={{ width: chartWidth }}>
            <Text style={styles.chartTitle}>Pastel</Text>
            <PieChart
              data={pieData}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="5"
              absolute
            />
          </View>
        </View>
      )}
    </View>
  );
}

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};
