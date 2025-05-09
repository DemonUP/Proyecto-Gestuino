import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import styles from '../styles/ConfiguracionesStyles';
import {
  obtenerConfiguraciones,
  actualizarConfiguracion
} from '../controllers/ConfiguracionesController';

export default function ConfiguracionScreen() {
  const [iva, setIva] = useState('');
  const [propina, setPropina] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const config = await obtenerConfiguraciones();
      setIva(config.iva.toString());
      setPropina(config.propina.toString());
      setLoading(false);
    };
    cargar();
  }, []);

  const guardar = async () => {
    const ok1 = await actualizarConfiguracion('iva', parseFloat(iva));
    const ok2 = await actualizarConfiguracion('propina', parseFloat(propina));

    if (ok1 && ok2) {
      Alert.alert('Éxito', 'Configuraciones guardadas');
    } else {
      Alert.alert('Error', 'Hubo un problema al guardar');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#a94442" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configuraciones del Restaurante</Text>

      <Text style={styles.label}>IVA (%)</Text>
      <TextInput
        style={styles.input}
        value={iva}
        onChangeText={setIva}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Propina (%)</Text>
      <TextInput
        style={styles.input}
        value={propina}
        onChangeText={setPropina}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={guardar}>
        <Text style={styles.botonTexto}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}
