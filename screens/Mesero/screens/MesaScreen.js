import React from 'react';
import { View, Text, FlatList, Modal, Button, TouchableOpacity } from 'react-native';
import { useMesaController } from '../controllers/mesaController';
import styles from '../styles/mesaStyles';

export default function MesaScreen({ navigation }) {
  const {
    mesas, mesaSeleccionada, pedidos, total, modalVisible,
    abrirMesa, setModalVisible
  } = useMesaController(navigation);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.mesa} onPress={() => abrirMesa(item)}>
      <Text style={styles.mesaText}>Mesa {item.numero}</Text>
      <Text style={styles.estado}>{item.estado.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={mesas} keyExtractor={item => item.id.toString()} renderItem={renderItem} />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Mesa {mesaSeleccionada?.numero}</Text>

          {pedidos.length === 0 ? (
            <Text style={styles.empty}>No hay pedidos activos.</Text>
          ) : (
            pedidos.map((p) => (
              <Text key={p.id}>
                {p.cantidad} x {p.productos.nombre} - ${p.cantidad * p.productos.precio}
              </Text>
            ))
          )}

          <Text style={styles.total}>Total: ${total}</Text>

          <Button
            title="Generar Factura"
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('Factura', { mesa: mesaSeleccionada });
            }}
            disabled={pedidos.length === 0}
          />
          <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#888" />
        </View>
      </Modal>
    </View>
  );
}
