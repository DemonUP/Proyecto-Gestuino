import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './Styles/AdminSidebarStyles';

const items = [
  { name: 'Dashboard',       icon: 'home',       route: 'AdminHome' },
  { name: 'Asignar Roles',   icon: 'users',      route: 'Roles' },
  { name: 'Reportes de Ventas', icon: 'bar-chart', route: 'Reportes' },
  { name: 'Inventario',      icon: 'box',        route: 'Inventario' },
  { name: 'Gestión de Menú', icon: 'book-open',  route: 'Menu' },
  { name: 'Configuraciones', icon: 'settings',   route: 'Configuraciones' },
];

export default function AdminSidebar({ navigation, activeRoute }) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <View style={styles.penguin}>
          <View style={styles.penguinBelly} />
          <View style={styles.penguinBeak} />
        </View>
        <Text style={styles.logoText}>Gestuino</Text>
      </View>
      {items.map(item => (
        <Pressable
          key={item.route}
          style={[
            styles.link,
            activeRoute === item.route && styles.activeMenu
          ]}
          onPress={() => navigation.navigate(item.route)}
        >
          <Feather name={item.icon} size={20} color="#4B5563" />
          <Text style={styles.linkText}>{item.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}
