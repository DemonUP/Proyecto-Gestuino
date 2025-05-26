import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMesaController } from './controllers/mesaController';
import AdminSidebar from '../../components/AdminSidebar';
import styles from './styles/MeseroHomeStyles';

const SIDEBAR_WIDTH = 280;
const PADDING = 32;
const GAP = 16;

function getColumns(width) {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function MeseroHome({ usuario, navigation, onLogout }) {
  const { mesas, pedidos, abrirMesa } = useMesaController(navigation);

  const [layoutWidth, setLayoutWidth] = useState(
    Dimensions.get('window').width
  );
  const [numColumns, setNumColumns] = useState(
    getColumns(layoutWidth - SIDEBAR_WIDTH)
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setLayoutWidth(window.width);
      setNumColumns(getColumns(window.width - SIDEBAR_WIDTH));
    });
    return () => sub?.remove();
  }, []);

  const contentWidth = layoutWidth - SIDEBAR_WIDTH;
  const cardWidth =
    (contentWidth - PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const stats = [
    { key: 'pedidos', label: 'Pedidos activos', value: pedidos.length.toString() },
    { key: 'mesas',   label: 'Mesas asignadas', value: mesas.length.toString() },
    { key: 'propinas',label: 'Propinas hoy',    value: '$1,240' },
  ];

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
    const activa = mesa.estado === 'activa';
    return (
      <Pressable
        style={[
          styles.mesaCard,
          { width: cardWidth, marginRight: GAP },
        ]}
        onPress={() => abrirMesa(mesa)}
      >
        <View style={styles.mesaHeader}>
          <Text style={styles.mesaNumero}>Mesa {mesa.numero}</Text>
          <Text
            style={[
              styles.mesaEstado,
              activa && styles.mesaEstadoActiva,
            ]}
          >
            {activa ? 'Activa' : 'En espera'}
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
      {/* Sidebar con logout */}
      <AdminSidebar
        navigation={navigation}
        activeRoute="MeseroHome"
        onLogout={onLogout}
      />

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header: bienvenida + botón cerrar sesión */}
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
        <View style={{ flexDirection: 'row', marginBottom: GAP }}>
          {stats.map((s, i) => (
            <StatCard key={s.key} stat={s} isLast={i === stats.length - 1} />
          ))}
        </View>

        {/* Sección Mesas */}
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
