import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import AdminSidebar from '../../../components/AdminSidebar';
import { usePedidoController } from '../controllers/pedidoController';
import styles from '../styles/pedidoStyles';

export default function PedidoScreen({ usuario, navigation }) {
  const isMobile = Dimensions.get('window').width < 600;

  const {
    mesas,
    mesaSeleccionada,
    setMesaSeleccionada,
    cantidadPersonas,
    setCantidadPersonas,
    descripcionMesa,
    setDescripcionMesa,
    estadoMesa,
    setEstadoMesa,
    productos,
    pedido,
    pedidosExistentes,
    agregarProducto,
    eliminarProductoPorCantidad,
    eliminarPedidoExistente,
    actualizarEstadoMesa,
    enviarPedido,
  } = usePedidoController(navigation);

  const [cantidadesEliminar, setCantidadesEliminar] = useState({});

  const groupedPedido = Object.values(
    pedido.reduce((acc, prod) => {
      const key = prod.id;
      if (!acc[key]) acc[key] = { ...prod, cantidad: 1 };
      else acc[key].cantidad++;
      return acc;
    }, {})
  );

  // Feedback visual y navegación
  const handleEnviarPedido = async () => {
    const exito = await enviarPedido(); // debes retornar true/false desde el hook
    if (exito) {
      Alert.alert("Pedido enviado", "El pedido se ha enviado correctamente.");
      navigation.navigate('AdminHome'); // o la vista que desees
    } else {
      Alert.alert("Error", "No se pudo enviar el pedido. Intenta nuevamente.");
    }
  };

  const handleActualizarEstado = async () => {
    const exito = await actualizarEstadoMesa();
    if (exito) {
      Alert.alert("Estado actualizado", "El estado de la mesa fue actualizado.");
    } else {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  return (
    <View style={styles.wrapper}>
      {!isMobile && <AdminSidebar />}
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Feather name="clipboard" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Pedidos</Text>
            <Text style={styles.headerSubtitle}>Gestión de Pedidos</Text>
          </View>
        </View>

        {/* Sección Mesa */}
        <View style={styles.section}>
          <Text style={styles.label}>Mesa</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={mesaSeleccionada}
              onValueChange={setMesaSeleccionada}
              style={styles.picker}
            >
              <Picker.Item label="-- Seleccionar --" value={null} />
              {mesas.map(m => (
                <Picker.Item
                  key={m.id}
                  label={`Mesa ${m.numero} (${m.estado})`}
                  value={m.id}
                />
              ))}
            </Picker>
          </View>

          {mesaSeleccionada && (
            <>
              <Text style={styles.label}>Cantidad de personas</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ej: 4"
                value={cantidadPersonas}
                onChangeText={setCantidadPersonas}
              />

              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Cumpleaños, reunión..."
                value={descripcionMesa}
                onChangeText={setDescripcionMesa}
              />

              <Text style={styles.label}>Estado de la mesa</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={estadoMesa}
                  onValueChange={setEstadoMesa}
                  style={styles.picker}
                >
                  <Picker.Item label="disponible" value="disponible" />
                  <Picker.Item label="ocupada" value="ocupada" />
                  <Picker.Item label="cerrada" value="cerrada" />
                </Picker>
              </View>

              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={handleActualizarEstado}
              >
                <Text style={styles.btnPrimaryText}>ACTUALIZAR ESTADO</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos disponibles</Text>
          <FlatList
            data={productos}
            keyExtractor={i => i.id.toString()}
            numColumns={isMobile ? 1 : 2}
            columnWrapperStyle={!isMobile && { justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.productCard}
                onPress={() => agregarProducto(item)}
              >
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productPrice}>
                  {item.precio.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Pedido Actual */}
        {groupedPedido.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pedido actual</Text>
            {groupedPedido.map(prod => (
              <View key={prod.id} style={styles.orderItem}>
                <Text style={styles.orderText}>
                  {prod.cantidad} × {prod.nombre} —{' '}
                  {(prod.cantidad * prod.precio).toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  })}
                </Text>
                <View style={styles.quantityControls}>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    placeholder="1"
                    value={cantidadesEliminar[prod.id]?.toString() || ''}
                    onChangeText={t =>
                      setCantidadesEliminar({
                        ...cantidadesEliminar,
                        [prod.id]: t,
                      })
                    }
                  />
                  <Pressable
                    onPress={() =>
                      eliminarProductoPorCantidad(
                        prod.id,
                        parseInt(cantidadesEliminar[prod.id]) || 1
                      )
                    }
                  >
                    <Text style={styles.deleteBtn}>✕</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pedidos Existentes */}
        {pedidosExistentes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pedidos activos</Text>
            {pedidosExistentes.map(p => (
              <View key={p.id} style={styles.orderItem}>
                <Text style={styles.orderText}>
                  {p.cantidad} × {p.productos.nombre} —{' '}
                  {p.productos.precio.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}
                </Text>
                <Pressable onPress={() => eliminarPedidoExistente(p.id)}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Enviar Pedido */}
        <Pressable
          style={[
            styles.btn,
            styles.btnPrimary,
            (!mesaSeleccionada || pedido.length === 0) && styles.btnDisabled,
          ]}
          onPress={handleEnviarPedido}
          disabled={!mesaSeleccionada || pedido.length === 0}
        >
          <Text style={styles.btnPrimaryText}>ENVIAR PEDIDO</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
