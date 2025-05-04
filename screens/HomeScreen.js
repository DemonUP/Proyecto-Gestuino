// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Gestuino 🎉</Text>
      <Button title="Cerrar Sesión" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
