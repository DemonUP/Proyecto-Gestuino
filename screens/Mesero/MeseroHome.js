import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminSidebar from '../../components/AdminSidebar';
import styles from './styles/MeseroHomeStyles';
import {
  obtenerPedidosActivos,
  obtenerMesasActivas,
  obtenerPropinasHoy,
} from '../../supabase'; // Ajusta si tu archivo está en otra ruta

const SIDEBAR_WIDTH = 280;
const PADDING = 32;
const GAP = 16;

function getColumns(width) {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function MeseroHome({ usuario, navigation, onLogout }) {
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);
  const [numColumns, setNumColumns] = useState(getColumns(layoutWidth - SIDEBAR_WIDTH));
  const [stats, setStats] = useState(null);
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const onChange = ({ window }) => {
      setLayoutWidth(window.width);
      setNumColumns(getColumns(window.width - SIDEBAR_WIDTH));
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      const [pedidos, mesasActivas, propinas] = await Promise.all([
        obtenerPedidosActivos(),
        obtenerMesasActivas(),
        obtenerPropinasHoy(),
      ]);

      setStats([
        { key: 'pedidos', label: 'Pedidos activos', value: pedidos.toString() },
        { key: 'mesas', label: 'Mesas activas', value: mesasActivas.toString() },
        {
          key: 'propinas',
          label: 'Propinas hoy',
          value: propinas.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
          }),
        },
      ]);
    };

    cargarDatos();
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    const { data, error } = await supabase
      .from('mesas')
      .select(`
        id,
        numero,
        estado,
        pedidos (
          cantidad,
          productos (
            nombre,
            precio
          )
        )
      `);

    if (error) {
      console.error('Error cargando mesas:', error);
      setMesas([]);
      return;
    }

    setMesas(data);
  };

  const contentWidth = layoutWidth - SIDEBAR_WIDTH;
  const cardWidth =
    (contentWidth - PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  function StatCard({ stat, isLast }) {
    return (
      <View
        style={[
          styles.statCard,
          { flex: 1, marginRight: isLast ? 0 : GAP },
        ]}
      >
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    );
  }

  function MesaCard({ mesa }) {
    const estadoMesa = mesa.estado?.toLowerCase();
    const activa = ['ocupada', 'cerrada'].includes(estadoMesa);

    return (
      <Pressable
        style={[
          styles.mesaCard,
          { width: cardWidth, marginRight: GAP },
          estadoMesa === 'cerrada' && { borderColor: '#7e22ce', borderWidth: 2 },
        ]}
        onPress={() => navigation.navigate('Pedido', { mesa })}
      >
        <View style={styles.mesaHeader}>
          <Text style={styles.mesaNumero}>Mesa {mesa.numero}</Text>
          <Text
            style={[
              styles.mesaEstado,
              activa && styles.mesaEstadoActiva,
              estadoMesa === 'cerrada' && { color: '#7e22ce' },
            ]}
          >
            {estadoMesa === 'cerrada'
              ? 'Cerrada'
              : activa
              ? 'Ocupada'
              : 'Disponible'}
          </Text>
        </View>
        {mesa.pedidos?.map((p, i) => (
          <View key={i} style={styles.pedidoItem}>
            <Text>
              {p.cantidad}x {p.productos.nombre}
            </Text>
            <Text>
              {(p.cantidad * p.productos.precio).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
              })}
            </Text>
          </View>
        ))}
      </Pressable>
    );
  }

  return (
    <View style={styles.wrapper}>
      <AdminSidebar
        navigation={navigation}
        activeRoute="MeseroHome"
        onLogout={onLogout}
      />

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            paddingHorizontal: PADDING,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            ¡Bienvenido, mesero/a {usuario.nombre} {usuario.apellido}!
          </Text>
          <TouchableOpacity
            onPress={onLogout}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.7}
          >
            <Text style={{ marginRight: 4, fontSize: 16 }}>Cerrar Sesión</Text>
            <Ionicons name="log-out-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={{ flexDirection: 'row', marginBottom: GAP, paddingHorizontal: PADDING }}>
          {stats &&
            stats.map((s, i) => (
              <StatCard key={s.key} stat={s} isLast={i === stats.length - 1} />
            ))}
        </View>

        {/* Mesas */}
        <View style={styles.tablesSection}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mesas Asignadas</Text>
            <Pressable
              style={styles.newButton}
              onPress={() => navigation.navigate('Pedido')}
            >
              <Text style={styles.newButtonText}>+ Nuevo Pedido</Text>
            </Pressable>
          </View>
          <View style={styles.mesasGrid}>
            {mesas.map((mesa) => (
              <MesaCard key={mesa.id} mesa={mesa} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
