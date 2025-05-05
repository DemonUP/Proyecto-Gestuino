// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { loginUsuario } from '../supabase';

export default function LoginScreen({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    const res = await loginUsuario(correo, contrasena);
    if (res.success) {
      onLogin(res.user);
    } else {
      Alert.alert('Error', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestuino 🍽️</Text>

      <TextInput
        placeholder="Correo"
        placeholderTextColor="#555"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#555"
        secureTextEntry
        style={styles.input}
        value={contrasena}
        onChangeText={setContrasena}
      />

      <View style={styles.boton}>
        <Button title="Iniciar Sesión" color="#a94442" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fddede', // fondo rosado claro
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#800000',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  boton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
