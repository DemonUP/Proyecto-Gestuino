import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import styles from '../styles/facturaStyles';
import { useFacturaController } from '../controllers/facturaController';

export default function FacturaScreen({ route, navigation }) {
  const { mesa } = route.params;
  const {
    pedidos, total, imprimirFactura, cerrarCuenta
  } = useFacturaController(mesa, navigation);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.cantidad} x {item.productos.nombre}</Text>
      <Text>${item.cantidad * item.productos.precio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Factura - Mesa {mesa.numero}</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Total: ${total}</Text>

      <Button title="Imprimir" onPress={imprimirFactura} disabled={pedidos.length === 0} />
      <View style={{ height: 10 }} />
      <Button title="Cerrar Cuenta" onPress={cerrarCuenta} disabled={pedidos.length === 0} />
    </View>
  );
}
