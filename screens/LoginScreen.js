import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { loginUsuario } from '../supabase';
import { Feather } from '@expo/vector-icons';
import styles from './Admin/styles/LoginStyles';

export default function LoginScreen({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correoFocus, setCorreoFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1250,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('Advertencia', 'Debe completar todos los campos');
      return;
    }

    const res = await loginUsuario(correo, contrasena);
    if (res.success) {
      onLogin(res.user);
    } else {
      Alert.alert('Error', res.message);
    }
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Animated.View
          style={[
            styles.penguin,
            { transform: [{ translateY: bounceAnim }] }
          ]}
        >
          <View style={styles.penguinBelly} />
          <View style={styles.penguinBeak} />
        </Animated.View>

        <Text style={styles.title}>
          <Text style={styles.titleG}>G</Text>ESTUINO
        </Text>
        <Text style={styles.subtitle}>Gestión Integral de Restaurantes</Text>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Usuario"
              placeholderTextColor="#6B7280"
              style={[
                styles.input,
                correoFocus && styles.inputFocus
              ]}
              onFocus={() => setCorreoFocus(true)}
              onBlur={() => setCorreoFocus(false)}
              value={correo}
              onChangeText={setCorreo}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="lock" size={24} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              secureTextEntry
              style={[
                styles.input,
                passFocus && styles.inputFocus
              ]}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              value={contrasena}
              onChangeText={setContrasena}
            />
          </View>

          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>Acceder al sistema</Text>
            <Feather
              name="arrow-right"
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
