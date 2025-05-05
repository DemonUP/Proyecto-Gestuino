// screens/Mesero/MeseroHome.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MeseroHome({ usuario, navigation, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {usuario.nombre} 👋</Text>

      <View style={styles.menu}>
        <View style={styles.button}>
          <Button title="Ver Mesas" color="#8B0000" onPress={() => navigation.navigate('Mesas')} />
        </View>
        <View style={styles.button}>
          <Button title="Tomar Pedido" color="#B22222" onPress={() => navigation.navigate('Pedido')} />
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
    backgroundColor: '#fddede', // fondo rosado claro
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
