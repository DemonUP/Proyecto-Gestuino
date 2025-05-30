import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AdminSidebar from '../../../components/AdminSidebar';
import {
  obtenerConfiguraciones,
  actualizarConfiguracion,
} from '../controllers/ConfiguracionesController';
import styles from '../styles/ConfiguracionesStyles';

export default function ConfiguracionScreen() {
  const [iva, setIva] = useState('');
  const [propina, setPropina] = useState('');
  const [loading, setLoading] = useState(true);
  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    (async () => {
      const config = await obtenerConfiguraciones();
      setIva(config.iva.toString());
      setPropina(config.propina.toString());
      setLoading(false);
    })();
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
      <View style={styles.wrapper}>
        <AdminSidebar /> {/* Sidebar responsivo SIEMPRE */}
        <View style={styles.mainContent}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <AdminSidebar /> {/* Sidebar responsivo SIEMPRE */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Feather name="settings" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              Configuraciones del Restaurante
            </Text>
            <Text style={styles.headerSubtitle}>
              Parámetros operativos principales
            </Text>
          </View>
        </View>

        {/* Card */}
        <Pressable
          style={({ hovered }) => [
            styles.configCard,
            hovered && styles.configCardHover,
          ]}
        >
          {/* IVA */}
          <View style={styles.field}>
            <Text style={styles.label}>
              IVA (%) <Text style={{ color: '#FF6B35' }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.configInput,
                  focusField === 'iva' && styles.configInputFocus,
                ]}
                value={iva}
                onChangeText={setIva}
                keyboardType="numeric"
                onFocus={() => setFocusField('iva')}
                onBlur={() => setFocusField(null)}
                placeholder="19"
              />
              <Text style={styles.percentIcon}>%</Text>
            </View>
          </View>

          {/* Propina */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Propina (%) <Text style={{ color: '#FF6B35' }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.configInput,
                  focusField === 'propina' && styles.configInputFocus,
                ]}
                value={propina}
                onChangeText={setPropina}
                keyboardType="numeric"
                onFocus={() => setFocusField('propina')}
                onBlur={() => setFocusField(null)}
                placeholder="10"
              />
              <Text style={styles.percentIcon}>%</Text>
            </View>
          </View>

          {/* Guardar */}
          <Pressable
            style={({ hovered }) => [
              styles.saveBtn,
              hovered && styles.saveBtnHover,
            ]}
            onPress={guardar}
          >
            <Text style={styles.saveBtnText}>Guardar Cambios</Text>
          </Pressable>
        </Pressable>
      </ScrollView>
    </View>
  );
}
