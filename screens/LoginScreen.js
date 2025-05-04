// screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ onLogin, onGoToRegister }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestuino - Iniciar Sesión</Text>
      <TextInput placeholder="Correo" style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} />
      <Button title="Entrar" onPress={onLogin} />
      <Button title="Registrarse" onPress={onGoToRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
});
