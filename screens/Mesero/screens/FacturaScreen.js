import React, { useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useFacturaController } from '../controllers/facturaController';
import styles from '../styles/facturaStyles'; // Importa estilos desde archivo externo

export default function FacturaScreen({ route, navigation }) {
  const { mesa } = route.params;
  const {
    pedidos, total, imprimirFactura, cerrarCuenta
  } = useFacturaController(mesa, navigation);

  const [mostrarToast, setMostrarToast] = useState(false);

  const handleImprimir = () => {
    imprimirFactura(); 
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
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

      <Button title="Imprimir" onPress={handleImprimir} disabled={pedidos.length === 0} />
      <View style={{ height: 10 }} />
      <Button title="Cerrar Cuenta" onPress={cerrarCuenta} disabled={pedidos.length === 0} />

      {mostrarToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✅ Factura impresa con éxito</Text>
        </View>
      )}
    </View>
  );
}
