// screens/Mesero/screens/FacturaScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useFacturaController } from '../controllers/facturaController';
import styles from '../styles/facturaStyles';

export default function FacturaScreen({ route, navigation }) {
  const { mesa } = route.params;
  const {
    pedidos,
    subtotal,
    iva,
    propina,
    ivaTotal,
    propinaTotal,
    totalConPropina,
    totalSinPropina,
    cerrarCuenta,
    imprimirFactura
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

      <View style={{ marginTop: 20 }}>
        <Text style={styles.total}>Subtotal: ${subtotal}</Text>
        <Text style={styles.total}>IVA ({iva}%): ${ivaTotal}</Text>
        <Text style={styles.total}>Propina ({propina}%): ${propinaTotal}</Text>
        <Text style={styles.total}>Total con propina: ${totalConPropina}</Text>
        <Text style={styles.total}>Total sin propina: ${totalSinPropina}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, pedidos.length === 0 && styles.buttonDisabled]}
        onPress={handleImprimir}
        disabled={pedidos.length === 0}
      >
        <Text style={styles.buttonText}>IMPRIMIR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, pedidos.length === 0 && styles.buttonDisabled]}
        onPress={cerrarCuenta}
        disabled={pedidos.length === 0}
      >
        <Text style={styles.buttonText}>CERRAR CUENTA SIN PROPINA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, pedidos.length === 0 && styles.buttonDisabled]}
        onPress={() => cerrarCuenta(true)}
        disabled={pedidos.length === 0}
      >
        <Text style={styles.buttonText}>CERRAR CUENTA CON PROPINA</Text>
      </TouchableOpacity>

      {mostrarToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✅ Factura impresa con éxito</Text>
        </View>
      )}
    </View>
  );
}
