// screens/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function RegisterScreen({ onGoBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput placeholder="Nombre" style={styles.input} />
      <TextInput placeholder="Apellido" style={styles.input} />
      <TextInput placeholder="Correo" style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} />
      <Button title="Registrarse" onPress={() => alert('Función no implementada')} />
      <Button title="Volver" onPress={onGoBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
});
