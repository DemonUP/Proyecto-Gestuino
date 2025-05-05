import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Button, Picker
} from 'react-native';
import styles from '../styles/pedidoStyles';
import { usePedidoController } from '../controllers/pedidoController';

export default function PedidoScreen({ navigation }) {
  const {
    mesas, mesaSeleccionada, setMesaSeleccionada,
    estadoMesa, setEstadoMesa, productos,
    pedido, pedidosExistentes,
    agregarProducto, eliminarProductoSeleccionado, eliminarPedidoExistente,
    actualizarEstadoMesa, enviarPedido
  } = usePedidoController(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INGRESO DE PEDIDOS</Text>

      <Text style={styles.label}>Mesa:</Text>
      <Picker
        selectedValue={mesaSeleccionada}
        onValueChange={setMesaSeleccionada}
        style={styles.input}
      >
        <Picker.Item label="-- Seleccionar --" value={null} />
        {mesas.map((mesa) => (
          <Picker.Item key={mesa.id} label={`Mesa ${mesa.numero} (${mesa.estado})`} value={mesa.id} />
        ))}
      </Picker>

      {mesaSeleccionada && (
        <>
          <Text style={styles.label}>Estado:</Text>
          <Picker
            selectedValue={estadoMesa}
            onValueChange={setEstadoMesa}
            style={styles.input}
          >
            <Picker.Item label="disponible" value="disponible" />
            <Picker.Item label="ocupada" value="ocupada" />
            <Picker.Item label="cerrada" value="cerrada" />
          </Picker>
          <Button title="Actualizar estado" onPress={actualizarEstadoMesa} />
        </>
      )}

      <Text style={styles.sectionTitle}>Productos:</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => agregarProducto(item)}>
            <Text>{item.nombre} - ${item.precio}</Text>
          </TouchableOpacity>
        )}
      />

      {pedido.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Seleccionados:</Text>
          {pedido.map((p, i) => (
            <View key={i} style={styles.row}>
              <Text>{p.nombre} - ${p.precio}</Text>
              <TouchableOpacity onPress={() => eliminarProductoSeleccionado(i)}>
                <Text style={styles.delete}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      <Button
        title="Enviar Pedido"
        onPress={enviarPedido}
        disabled={!mesaSeleccionada || pedido.length === 0}
      />

      {pedidosExistentes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pedidos actuales:</Text>
          {pedidosExistentes.map((p) => (
            <View key={p.id} style={styles.row}>
              <Text>{p.cantidad} x {p.productos.nombre} - ${p.productos.precio}</Text>
              <TouchableOpacity onPress={() => eliminarPedidoExistente(p.id)}>
                <Text style={styles.delete}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </View>
  );
}
