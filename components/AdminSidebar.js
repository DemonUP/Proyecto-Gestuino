// AdminSidebar.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './Styles/AdminSidebarStyles';

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

const SIDEBAR_WIDTH = 280;
const MOBILE_BREAKPOINT = 700; // px, ajusta si quieres

export default function AdminSidebar({ navigation: navProp, activeRoute: activeRouteProp }) {
  const navigation = useNavigation() || navProp;
  const route = useRoute();
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < MOBILE_BREAKPOINT);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsMobile(window.width < MOBILE_BREAKPOINT);
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  // Rol dinámico
  const activeRoute = activeRouteProp || route.name;
  const isMeseroRoute = meseroItems.some(item => item.route === activeRoute);
  const items = isMeseroRoute ? meseroItems : adminItems;

  // Menu (drawer) content reutilizable
  const MenuContent = ({ closeDrawer }) => (
    <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      {/* Logo y título */}
      <View style={styles.logoContainer}>
        <View style={styles.penguin}><View style={styles.penguinBelly}/><View style={styles.penguinBeak}/></View>
        <Text style={styles.logoText}>Gestuino</Text>
      </View>
      {/* Menú */}
      {items.map(item => {
        const isActive = activeRoute === item.route;
        return (
          <Pressable
            key={item.route}
            style={[styles.link, isActive && styles.activeMenu]}
            onPress={() => {
              navigation.navigate(item.route);
              if (isMobile && closeDrawer) closeDrawer();
            }}
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

  if (!isMobile) {
    // ESCRITORIO: sidebar fijo
    return <MenuContent />;
  }

  // MÓVIL: botón y Drawer modal
  return (
    <>
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => setDrawerOpen(true)}
        activeOpacity={0.7}
      >
        <Feather name="menu" size={28} color="#4B5563" />
      </TouchableOpacity>

      <Modal
        visible={drawerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setDrawerOpen(false)}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setDrawerOpen(false)}
        />
        <View style={styles.drawer}>
          <MenuContent closeDrawer={() => setDrawerOpen(false)} />
        </View>
      </Modal>
    </>
  );
}
