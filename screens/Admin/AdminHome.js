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
import AdminSidebar from '../../components/AdminSidebar';
import styles from './styles/AdminHomeStyles';

// Ancho fijo del sidebar para cálculos
const SIDEBAR_WIDTH = 280;

export default function AdminHome({ usuario, navigation, onLogout }) {
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);
  const [numColumns, setNumColumns] = useState(getColumns(layoutWidth));

  useEffect(() => {
    const onChange = ({ window }) => {
      setLayoutWidth(window.width);
      setNumColumns(getColumns(window.width));
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  const PADDING = 16;
  const GAP = 16;
  const contentWidth = layoutWidth - SIDEBAR_WIDTH;
  const CARD_WIDTH = (contentWidth - PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const metrics = [
    { key: 'ventas', title: 'Ventas Hoy', value: '$2,450', subtitle: '+18% vs ayer', progress: 0.75, Icon: 'cash-outline' },
    { key: 'ocupacion', title: 'Ocupación', value: '75%', subtitle: '28/36 mesas', progress: 0.67, Icon: 'clipboard-outline' },
    { key: 'inventario', title: 'Inventario Crítico', value: '4 items', tags: ['Filete', 'Vino Tinto'], progress: 0, Icon: 'cube-outline' },
    { key: 'reservas', title: 'Reservas', value: '15', subtitle: 'Próxima: 20:30h', progress: 0.5, Icon: 'calendar-outline' },
  ];

  return (
    <View style={styles.wrapper}>
      <AdminSidebar navigation={navigation} activeRoute="AdminHome" />
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={[styles.container, { padding: PADDING }]}>          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                Bienvenido, <Text style={styles.highlight}>Administrador/a {usuario.nombre} {usuario.apellido}</Text>
              </Text>
              <Text style={styles.status}>
                Estado del sistema: <Text style={styles.onlineDot}>●</Text> Operativo
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                <Ionicons name="log-out-outline" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Métricas en 1/2/4 columnas según ancho */}
          <View style={[styles.metricsGrid, { marginBottom: PADDING }]}>            
            {metrics.map((m, i) => (
              <MetricCard
                key={m.key}
                data={m}
                width={CARD_WIDTH}
                gap={GAP}
                isLastInRow={((i + 1) % numColumns) === 0}
              />
            ))}
          </View>

          {/* Solo el gráfico de tendencia */}
          <View style={styles.bottomSection}>
            <TrendCard />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Breakpoints: ≥1024 → 4 columnas, ≥768 → 2 columnas, <768 → 1 columna
function getColumns(width) {
  if (width >= 1024) return 4;
  if (width >= 768) return 2;
  return 1;
}

function MetricCard({ data, width, gap, isLastInRow }) {
  const { title, value, subtitle, progress, tags, Icon } = data;
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
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} /></View>
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

function TrendCard() {
  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>Tendencia de Ventas</Text>
        <View style={styles.trendButtons}>
          <Text style={styles.trendOption}>7D</Text>
          <Text style={styles.trendOption}>30D</Text>
          <Text style={[styles.trendOption, styles.trendOptionActive]}>Personalizado</Text>
        </View>
      </View>
      <View style={styles.trendPlaceholder}>
        <Text style={styles.trendPlaceholderText}>[Área para gráfico interactivo]</Text>
      </View>
    </View>
  );
}
