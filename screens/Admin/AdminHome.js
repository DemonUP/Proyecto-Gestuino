import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdminHome({ usuario, navigation, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {usuario.nombre} 👋</Text>

      <View style={styles.menu}>
        <View style={styles.button}>
          <Button title="Asignar Roles" color="#8B0000" onPress={() => navigation.navigate('Roles')} />
        </View>
        <View style={styles.button}>
          <Button title="Reportes de Ventas" color="#B22222" onPress={() => navigation.navigate('Reportes')} />
        </View>
        <View style={styles.button}>
          <Button title="Inventario" color="#A52A2A" onPress={() => navigation.navigate('Inventario')} />
        </View>
        <View style={styles.button}>
          <Button title="Gestión de Menú" color="#CD5C5C" onPress={() => navigation.navigate('Menu')} />
        </View>
        <View style={styles.button}>
          <Button title="Configuraciones" color="#DA7B93" onPress={() => navigation.navigate('Configuraciones')} />
        </View>
        <View style={styles.button}>
          <Button title="Cerrar Sesión" color="#c0392b" onPress={onLogout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fddede',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    color: '#800000',
    fontWeight: 'bold',
  },
  menu: {
    width: '100%',
    gap: 20,
  },
  button: {
    marginVertical: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
