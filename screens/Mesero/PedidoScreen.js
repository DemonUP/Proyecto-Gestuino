import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';
import supabase from '../../supabase';

export default function MesasScreen({ navigation }) {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    const { data, error } = await supabase.from('mesas').select('*');
    if (error) {
      console.error('Error al obtener mesas:', error);
    } else {
      setMesas(data);
    }
  };

  const abrirMesa = async (mesa) => {
    setMesaSeleccionada(mesa);
    setModalVisible(true);
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, cantidad, estado, productos:producto_id(nombre, precio)')
      .eq('mesa_id', mesa.id)
      .neq('estado', 'facturado');

    if (error) {
      console.error('Error al obtener pedidos:', error);
      setPedidos([]);
      setTotal(0);
    } else {
      setPedidos(data);
      const totalCalculado = data.reduce((acc, item) => {
        return acc + item.cantidad * item.productos.precio;
      }, 0);
      setTotal(totalCalculado);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.mesa} onPress={() => abrirMesa(item)}>
      <Text style={styles.mesaText}>Mesa {item.numero}</Text>
      <Text style={styles.estado}>{item.estado.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mesas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Mesa {mesaSeleccionada?.numero}</Text>

          {pedidos.length === 0 ? (
            <Text style={styles.empty}>No hay pedidos activos.</Text>
          ) : (
            pedidos.map((p) => (
              <Text key={p.id}>
                {p.cantidad} x {p.productos.nombre} - ${p.productos.precio * p.cantidad}
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
            color="#D96C6C"
          />

          <Button title="Imprimir" onPress={() => console.log('Imprimir factura...')} color="#B45F5F" />

          <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#888" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFE4E1',
  },
  mesa: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFD1D1',
    borderRadius: 5,
  },
  mesaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C0000',
  },
  estado: {
    fontSize: 14,
    color: '#800000',
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#800000',
  },
  total: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#5C0000',
  },
});
