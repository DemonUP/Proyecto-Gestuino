import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/pedidoStyles';
import { usePedidoController } from '../controllers/pedidoController';

export default function PedidoScreen({ navigation }) {
  const {
    mesas, mesaSeleccionada, setMesaSeleccionada,
    estadoMesa, setEstadoMesa, productos,
    pedido, pedidosExistentes,
    agregarProducto, eliminarProductoPorCantidad, eliminarPedidoExistente,
    actualizarEstadoMesa, enviarPedido
  } = usePedidoController(navigation);

  const [cantidadesEliminar, setCantidadesEliminar] = useState({});

  const groupedPedido = Object.values(
    pedido.reduce((acc, prod) => {
      const key = prod.id;
      if (!acc[key]) {
        acc[key] = { ...prod, cantidad: 1 };
      } else {
        acc[key].cantidad += 1;
      }
      return acc;
    }, {})
  );

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
          <TouchableOpacity style={styles.botonRojo} onPress={actualizarEstadoMesa}>
            <Text style={styles.botonTexto}>ACTUALIZAR ESTADO</Text>
          </TouchableOpacity>
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

      {groupedPedido.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Seleccionados:</Text>
          <FlatList
            data={groupedPedido}
            keyExtractor={(item) => item.id.toString()}
            style={{ maxHeight: 200 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text>{item.cantidad} x {item.nombre} - ${item.cantidad * item.precio}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      width: 40,
                      height: 35,
                      marginHorizontal: 5,
                      textAlign: 'center',
                      backgroundColor: 'white'
                    }}
                    keyboardType="numeric"
                    placeholder="1"
                    value={cantidadesEliminar[item.id] || ''}
                    onChangeText={(text) =>
                      setCantidadesEliminar({ ...cantidadesEliminar, [item.id]: text })
                    }
                  />
                  <TouchableOpacity
                    onPress={() =>
                      eliminarProductoPorCantidad(item.id, parseInt(cantidadesEliminar[item.id]) || 1)
                    }
                  >
                    <Text style={styles.delete}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.botonRojo, { marginTop: 15 }]}
        onPress={enviarPedido}
        disabled={!mesaSeleccionada || pedido.length === 0}
      >
        <Text style={styles.botonTexto}>ENVIAR PEDIDO</Text>
      </TouchableOpacity>

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
