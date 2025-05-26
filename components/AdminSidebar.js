// AdminSidebar.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './Styles/AdminSidebarStyles';

// Definimos dos conjuntos de rutas
const adminItems = [
  { name: 'Dashboard',           icon: 'home',       route: 'AdminHome' },
  { name: 'Asignar Roles',       icon: 'users',      route: 'Roles' },
  { name: 'Reportes de Ventas',  icon: 'bar-chart',  route: 'Reportes' },
  { name: 'Inventario',          icon: 'box',        route: 'Inventario' },
  { name: 'Gestión de Menú',     icon: 'book-open',  route: 'Menu' },
  { name: 'Configuraciones',     icon: 'settings',   route: 'Configuraciones' },
];
const meseroItems = [
  { name: 'Inicio Mesero', icon: 'home',        route: 'MeseroHome' },
  { name: 'Mesas',         icon: 'grid',        route: 'Mesas' },
  { name: 'Pedido',        icon: 'file-text',   route: 'Pedido' },
];

export default function AdminSidebar() {
  const navigation = useNavigation();
  const route = useRoute();
  const activeRoute = route.name;

  // Detectamos rol según la ruta activa
  const isMeseroRoute = meseroItems.some(item => item.route === activeRoute);
  const items = isMeseroRoute ? meseroItems : adminItems;

  return (
    <View style={styles.sidebar}>
      {/* Logo y título */}
      <View style={styles.logoContainer}>
        <View style={styles.penguin}><View style={styles.penguinBelly}/><View style={styles.penguinBeak}/></View>
        <Text style={styles.logoText}>Gestuino</Text>
      </View>

      {/* Menú de navegación según rol inferido */}
      {items.map(item => {
        const isActive = activeRoute === item.route;
        return (
          <Pressable
            key={item.route}
            style={[styles.link, isActive && styles.activeMenu]}
            onPress={() => navigation.navigate(item.route)}
          >
            <Feather name={item.icon} size={20} color={isActive ? '#FF6B35' : '#4B5563'} />
            <Text style={[styles.linkText, isActive && styles.activeText]}>
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
