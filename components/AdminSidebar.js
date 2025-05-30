// AdminSidebar.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Dimensions, TouchableOpacity } from 'react-native';
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
const MOBILE_BREAKPOINT = 700;

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

  // Detectamos rol según la ruta activa
  const activeRoute = activeRouteProp || route.name;
  const isMeseroRoute = meseroItems.some(item => item.route === activeRoute);
  const items = isMeseroRoute ? meseroItems : adminItems;

  // Menú reusable para sidebar y Drawer
  const MenuContent = ({ closeDrawer }) => (
    <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      {/* Logo y título */}
      <View style={styles.logoContainer}>
        <View style={styles.penguin}>
          <View style={styles.penguinBelly} />
          <View style={styles.penguinBeak} />
        </View>
        <Text style={styles.logoText}>Gestuino</Text>
      </View>
      {/* Menú de navegación */}
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
    // ESCRITORIO: Sidebar fijo
    return <MenuContent />;
  }

  // MÓVIL: Botón hamburguesa y Drawer modal
  return (
    <>
      {/* Botón hamburguesa SOLO FUERA del Drawer */}
      {!drawerOpen && (
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setDrawerOpen(true)}
          activeOpacity={0.7}
        >
          <Feather name="menu" size={28} color="#FF6B35" />
        </TouchableOpacity>
      )}

      {/* Drawer modal para mobile */}
      <Modal
        visible={drawerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setDrawerOpen(false)}
      >
        {/* Overlay para cerrar tocando fuera */}
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setDrawerOpen(false)}
        />
        {/* Drawer sidebar */}
        <View style={styles.drawer}>
          {/* Botón cerrar arriba a la derecha */}
          <TouchableOpacity
            style={styles.drawerCloseButton}
            onPress={() => setDrawerOpen(false)}
            activeOpacity={0.7}
          >
            <Feather name="x" size={28} color="#FF6B35" />
          </TouchableOpacity>
          {/* Menú lateral */}
          <MenuContent closeDrawer={() => setDrawerOpen(false)} />
        </View>
      </Modal>
    </>
  );
}
