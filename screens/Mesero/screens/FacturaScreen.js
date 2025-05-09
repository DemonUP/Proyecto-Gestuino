import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFacturaController } from '../controllers/facturaController';
import { obtenerConfiguraciones } from '../../Admin/controllers/ConfiguracionesController';
import styles from '../styles/facturaStyles';

export default function FacturaScreen({ route, navigation }) {
  const { mesa } = route.params;
  const {
    pedidos, total, imprimirFactura, cerrarCuenta
  } = useFacturaController(mesa, navigation);

  const [mostrarToast, setMostrarToast] = useState(false);
  const [config, setConfig] = useState({ iva: 0, propina: 0 });

  useEffect(() => {
    const cargarConfig = async () => {
      const data = await obtenerConfiguraciones();
      setConfig(data);
    };
    cargarConfig();
  }, []);

  const handleImprimir = () => {
    imprimirFactura();
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleCerrarConPropina = async () => {
    const totalIVA = total * (config.iva / 100);
    const totalPropina = total * (config.propina / 100);
    const totalFinal = total + totalIVA + totalPropina;

    await cerrarCuenta(totalFinal);
  };

  const handleCerrarSinPropina = async () => {
    const totalIVA = total * (config.iva / 100);
    const totalFinal = total + totalIVA;

    await cerrarCuenta(totalFinal);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.cantidad} x {item.productos.nombre}</Text>
      <Text>${item.cantidad * item.productos.precio}</Text>
    </View>
  );

  const totalIVA = total * (config.iva / 100);
  const totalPropina = total * (config.propina / 100);
  const totalConPropina = total + totalIVA + totalPropina;
  const totalSinPropina = total + totalIVA;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Factura - Mesa {mesa.numero}</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Subtotal: ${total}</Text>
      <Text style={styles.total}>IVA ({config.iva}%): ${totalIVA.toFixed(0)}</Text>
      <Text style={styles.total}>Propina ({config.propina}%): ${totalPropina.toFixed(0)}</Text>

      <Text style={styles.total}>Total con propina: ${totalConPropina.toFixed(0)}</Text>
      <Text style={styles.total}>Total sin propina: ${totalSinPropina.toFixed(0)}</Text>

      <TouchableOpacity
        style={[styles.button, pedidos.length === 0 && styles.buttonDisabled]}
        onPress={handleImprimir}
        disabled={pedidos.length === 0}
      >
        <Text style={styles.buttonText}>Imprimir</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, pedidos.length === 0 && styles.buttonDisabled]}
        onPress={handleCerrarConPropina}
        disabled={pedidos.length === 0}
      >
        <Text style={styles.buttonText}>Cerrar Cuenta con Propina</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, pedidos.length === 0 && styles.buttonDisabled]}
        onPress={handleCerrarSinPropina}
        disabled={pedidos.length === 0}
      >
        <Text style={styles.buttonText}>Cerrar Cuenta sin Propina</Text>
      </TouchableOpacity>

      {mostrarToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✅ Factura impresa con éxito</Text>
        </View>
      )}
    </View>
  );
}
