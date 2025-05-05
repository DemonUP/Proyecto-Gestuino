import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import supabase from '../../supabase';

export default function FacturaScreen({ route, navigation }) {
  const { mesa } = route.params;
  const [pedidos, setPedidos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, cantidad, productos:producto_id(nombre, precio)')
      .eq('mesa_id', mesa.id)
      .neq('estado', 'facturado');

    if (error) {
      console.error('Error al obtener pedidos:', error);
    } else {
      setPedidos(data);
      const totalCalculado = data.reduce(
        (acc, p) => acc + p.cantidad * p.productos.precio,
        0
      );
      setTotal(totalCalculado);
    }
  };

  const cerrarCuenta = async () => {
    const { error: pedidoError } = await supabase
      .from('pedidos')
      .update({ estado: 'facturado' })
      .eq('mesa_id', mesa.id)
      .neq('estado', 'facturado');

    const { error: mesaError } = await supabase
      .from('mesas')
      .update({ estado: 'disponible' })
      .eq('id', mesa.id);

    if (pedidoError || mesaError) {
      Alert.alert('Error', 'No se pudo cerrar la cuenta.');
    } else {
      Alert.alert('Cuenta cerrada', 'La mesa ha sido liberada.');
      navigation.goBack();
    }
  };

  const imprimirFactura = () => {
    console.log(`--- FACTURA MESA ${mesa.numero} ---`);
    pedidos.forEach((p) => {
      console.log(`${p.cantidad} x ${p.productos.nombre} = $${p.cantidad * p.productos.precio}`);
    });
    console.log(`TOTAL: $${total}`);
    Alert.alert('Factura generada', 'Verifica la consola para la impresión simulada.');
  };

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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  total: { marginTop: 30, fontSize: 18, fontWeight: 'bold' },
});
