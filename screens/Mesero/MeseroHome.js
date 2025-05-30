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
import supabase, { obtenerUsuarioDeSesion } from '../../supabase';

import {
  obtenerPedidosActivos,
  obtenerMesasActivas,
  obtenerPropinasHoy,
} from '../../supabase';

const SIDEBAR_WIDTH = 280;
const MOBILE_BREAKPOINT = 600;

function getColumns(width) {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function MeseroHome({ navigation, onLogout }) {
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);
  const [numColumns, setNumColumns] = useState(getColumns(layoutWidth - SIDEBAR_WIDTH));
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState(null);
  const [mesas, setMesas] = useState([]);
  const isMobile = layoutWidth < MOBILE_BREAKPOINT;

  useEffect(() => {
    const onChange = ({ window }) => {
      setLayoutWidth(window.width);
      setNumColumns(getColumns(window.width - SIDEBAR_WIDTH));
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    const cargar = async () => {
      const u = await obtenerUsuarioDeSesion();
      setUsuario(u);

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
          value: propinas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        },
      ]);

      if (u?.id) {
        cargarMesas(u.id);
      }
    };

    cargar();
  }, []);

  const cargarMesas = async (usuarioId) => {
    const { data, error } = await supabase
      .from('mesas')
      .select(`
        id,
        numero,
        estado,
        cantidad_personas,
        ocupada_desde,
        usuario_id,
        pedidos!pedidos_mesa_id_fkey (
          id,
          cantidad,
          creado_en,
          productos:producto_id (nombre, precio)
        )
      `)
      .eq('usuario_id', usuarioId); // ✅ Solo filtramos por usuario

    if (error) {
      console.error('Error cargando mesas:', error);
      setMesas([]);
      return;
    }

    const mesasConUltimoPedido = data
      .filter((m) => m.estado === 'ocupada')
      .map((m) => {
        const ocupadaDesde = m.ocupada_desde ? new Date(m.ocupada_desde) : null;

        const pedidosValidos = (m.pedidos || []).filter((p) => {
          return ocupadaDesde ? new Date(p.creado_en) >= ocupadaDesde : true;
        });

        const ultimoPedido =
          pedidosValidos.length > 0
            ? pedidosValidos.sort(
                (a, b) => new Date(b.creado_en) - new Date(a.creado_en)
              )[0]
            : null;

          return {
            ...m,
            ultimoPedido: pedidosValidos.length > 0 ? pedidosValidos[0] : null,
          };

      });

      setMesas(mesasConUltimoPedido);
     }; 


  function StatCard({ stat }) {
    return (
      <View style={[styles.statCard]}>
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
          isMobile && styles.mesaCardMobile,
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
            {estadoMesa === 'cerrada' ? 'Cerrada' : activa ? 'Ocupada' : 'Disponible'}
          </Text>
        </View>
          {mesa.ultimoPedido ? (
            <View style={styles.pedidoItem}>
              <Text>{mesa.ultimoPedido.cantidad}x {mesa.ultimoPedido.productos.nombre}</Text>
              <Text>
                {(mesa.ultimoPedido.cantidad * mesa.ultimoPedido.productos.precio).toLocaleString('es-CO', {
                  style: 'currency', currency: 'COP'
                })}
              </Text>
            </View>
          ) : (
          <Text style={{ color: '#718096' }}>Sin pedidos aún</Text>
        )}
        <Text style={{ marginTop: 4, fontStyle: 'italic', color: '#4A5568' }}>
          Personas: {mesa.cantidad_personas || '—'}
        </Text>
      </Pressable>
    );
  }

  if (!usuario) return null; // ⛔ Previene errores por usuario null

  return (
    <View style={styles.wrapper}>
      <AdminSidebar navigation={navigation} activeRoute="MeseroHome" onLogout={onLogout} />
      <ScrollView style={styles.mainContent} contentContainerStyle={[styles.contentContainer]}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', flexWrap: 'wrap' }}>
            ¡Bienvenido, mesero/a {usuario.nombre} {usuario.apellido}!
          </Text>
          <TouchableOpacity
            onPress={onLogout}
            style={[{ flexDirection: 'row', alignItems: 'center' }, isMobile && styles.logoutBtnMobile]}
          >
            <Text style={{ marginRight: 4, fontSize: 16 }}>Cerrar Sesión</Text>
            <Ionicons name="log-out-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={[styles.statsContainer]}>
          {stats && stats.map((s) => <StatCard key={s.key} stat={s} />)}
        </View>

        <View style={styles.tablesSection}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mesas Asignadas</Text>
            <Pressable
              style={[styles.newButton, isMobile && styles.newButtonMobile]}
              onPress={() => navigation.navigate('Pedido')}
            >
              <Text style={styles.newButtonText}>+ Nuevo Pedido</Text>
            </Pressable>
          </View>
          <View style={[styles.mesasGrid, isMobile && styles.mesasGridMobile]}>
            {mesas.map((mesa) => (
              <MesaCard key={mesa.id} mesa={mesa} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
