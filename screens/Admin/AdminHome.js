// screens/AdminHome.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdminHome({ usuario, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      <Text>Bienvenido, {usuario.nombre}</Text>
      <Button title="Cerrar Sesión" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
});
