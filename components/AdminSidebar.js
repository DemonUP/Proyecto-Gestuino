import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './Styles/AdminSidebarStyles';

const adminItems = [
  { name: 'Dashboard', icon: 'home', route: 'AdminHome' },
  { name: 'Asignar Roles', icon: 'users', route: 'Roles' },
  { name: 'Reportes de Ventas', icon: 'bar-chart', route: 'Reportes' },
  { name: 'Inventario', icon: 'box', route: 'Inventario' },
  { name: 'Gestión de Menú', icon: 'book-open', route: 'Menu' },
  { name: 'Configuraciones', icon: 'settings', route: 'Configuraciones' },
];
const meseroItems = [
  { name: 'Inicio Mesero', icon: 'home', route: 'MeseroHome' },
  { name: 'Mesas', icon: 'grid', route: 'Mesas' },
  { name: 'Pedido', icon: 'file-text', route: 'Pedido' },
];

const MOBILE_BREAKPOINT = 700;
const DRAWER_WIDTH = 280;
const STORAGE_KEY = 'sidebarButtonPosition';
const BUTTON_WIDTH = 50;
const BUTTON_HEIGHT = 50;
const SAFE_MARGIN = 10;

export default function AdminSidebar({ navigation: navProp, activeRoute: activeRouteProp }) {
  const navigation = useNavigation() || navProp;
  const route = useRoute();
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < MOBILE_BREAKPOINT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [position] = useState(new Animated.ValueXY({ x: 10, y: 100 }));
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Cargar posición guardada al iniciar
  useEffect(() => {
    setTimeout(async () => {
      try {
        const pos = await AsyncStorage.getItem(STORAGE_KEY);
        if (pos) {
          let { x, y } = JSON.parse(pos);
          const screen = Dimensions.get('window');
          x = Math.max(SAFE_MARGIN, Math.min(x, screen.width - BUTTON_WIDTH - SAFE_MARGIN));
          y = Math.max(SAFE_MARGIN, Math.min(y, screen.height - BUTTON_HEIGHT - SAFE_MARGIN));
          position.setValue({ x, y });
        }
      } catch {
        position.setValue({ x: 10, y: 100 });
      }
    }, 500);
  }, []);

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsMobile(window.width < MOBILE_BREAKPOINT);
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: drawerOpen ? 0 : -DRAWER_WIDTH,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [drawerOpen]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const screen = Dimensions.get('window');
      const newX = Math.max(SAFE_MARGIN, Math.min(gesture.moveX - BUTTON_WIDTH / 2, screen.width - BUTTON_WIDTH - SAFE_MARGIN));
      const newY = Math.max(SAFE_MARGIN, Math.min(gesture.moveY - BUTTON_HEIGHT / 2, screen.height - BUTTON_HEIGHT - SAFE_MARGIN));
      position.setValue({ x: newX, y: newY });
    },
    onPanResponderRelease: async (_, gesture) => {
      const screen = Dimensions.get('window');
      const finalX = gesture.moveX < screen.width / 2
        ? SAFE_MARGIN
        : screen.width - BUTTON_WIDTH - SAFE_MARGIN;
      const finalY = Math.max(
        SAFE_MARGIN,
        Math.min(gesture.moveY - BUTTON_HEIGHT / 2, screen.height - BUTTON_HEIGHT - SAFE_MARGIN)
      );

      Animated.spring(position.x, { toValue: finalX, useNativeDriver: false }).start();
      Animated.spring(position.y, { toValue: finalY, useNativeDriver: false }).start();

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ x: finalX, y: finalY }));
      } catch (err) {
        console.error('Error guardando posición:', err);
      }
    },
  });

  const activeRoute = activeRouteProp || route.name;
  const isMeseroRoute = meseroItems.some(item => item.route === activeRoute);
  const items = isMeseroRoute ? meseroItems : adminItems;

  const MenuContent = ({ closeDrawer }) => (
    <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      <View style={styles.logoContainer}>
        <View style={styles.penguin}>
          <View style={styles.penguinBelly} />
          <View style={styles.penguinBeak} />
        </View>
        <Text style={styles.logoText}>Gestuino</Text>
      </View>
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

  if (!isMobile) return <MenuContent />;

  return (
    <>
      {!drawerOpen && (
        <Animated.View
          style={[styles.hamburgerButton, { transform: position.getTranslateTransform() }]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
            <Feather name="menu" size={28} color="#FF6B35" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {drawerOpen && (
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setDrawerOpen(false)}
        />
      )}
      <Animated.View
        style={[
          styles.drawer,
          {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            transform: [{ translateX: slideAnim }],
            backgroundColor: 'white',
            elevation: 10,
            zIndex: 100,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.drawerCloseButton}
          onPress={() => setDrawerOpen(false)}
          activeOpacity={0.7}
        >
          <Feather name="x" size={28} color="#FF6B35" />
        </TouchableOpacity>
        <MenuContent closeDrawer={() => setDrawerOpen(false)} />
      </Animated.View>
    </>
  );
}
