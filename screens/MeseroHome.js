// screens/MeseroHome.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MeseroHome({ usuario, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vista de Mesero</Text>
      <Text>Hola, {usuario.nombre}</Text>
      <Button title="Cerrar Sesión" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
});
