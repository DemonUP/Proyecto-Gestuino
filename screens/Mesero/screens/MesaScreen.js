// screens/Mesero/screens/MesaScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useMesaController } from '../controllers/mesaController';
import AdminSidebar from '../../../components/AdminSidebar';
import styles from '../styles/mesaStyles';

export default function MesaScreen({ usuario, navigation }) {
  const {
    mesas,
    mesaSeleccionada,
    pedidos,
    total,
    modalVisible,
    abrirMesa,
    setModalVisible,
  } = useMesaController(navigation);

  const isMobile = Dimensions.get('window').width < 600;

  return (
    <View style={styles.wrapper}>
      {!isMobile && <AdminSidebar />}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.contentContainer}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Feather name="grid" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Mesas</Text>
            <Text style={styles.headerSubtitle}>Gestión de Mesas</Text>
          </View>
        </View>

        {/* Grid de Mesas */}
        <View style={styles.mesasGrid}>
          {mesas.map(mesa => (
            <Pressable
              key={mesa.id}
              style={[
                styles.mesaCard,
                mesa.estado === 'ocupada' && styles.mesaCardOcupada,
              ]}
              onPress={() => abrirMesa(mesa)}
            >
              <Text style={styles.mesaNumero}>Mesa {mesa.numero}</Text>
              <Text
                style={[
                  styles.mesaEstado,
                  mesa.estado === 'ocupada' && styles.mesaEstadoOcupada,
                ]}
              >
                {mesa.estado.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Modal de pedidos */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Mesa {mesaSeleccionada?.numero}
          </Text>

          {pedidos.length === 0 ? (
            <Text style={styles.pedidoItem}>No hay pedidos activos.</Text>
          ) : (
            pedidos.map(p => (
              <Text key={p.id} style={styles.pedidoItem}>
                {p.cantidad} x {p.productos.nombre} —{' '}
                {(p.cantidad * p.productos.precio).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </Text>
            ))
          )}

          <Text style={styles.total}>
            Total:{' '}
            {total.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
            })}
          </Text>

          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('Factura', { mesa: mesaSeleccionada });
            }}
            disabled={pedidos.length === 0}
          >
            <Text style={styles.btnPrimaryText}>Generar Factura</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.btnSecondaryText}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
);
}
