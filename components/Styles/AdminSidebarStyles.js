import { StyleSheet, Platform } from 'react-native';

const SIDEBAR_WIDTH = 280;

export default StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    height: '100%',
    zIndex: 2,
  },
  sidebarMobile: {
    // En móvil, barra va full alto
    ...Platform.select({
      android: { elevation: 12 },
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      default: {},
    }),
    height: '100%',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 2,
    ...Platform.select({
      android: { elevation: 24 },
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 2 } },
      default: {},
    }),
  },
  // ...El resto de tus estilos originales...
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  penguin: {
    width: 40,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    position: 'relative',
  },
  penguinBelly: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 50,
    top: '15%',
    left: '15%',
  },
  penguinBeak: {
    position: 'absolute',
    width: 8,
    height: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 1,
    bottom: '20%',
    right: -4,
    transform: [{ rotate: '-45deg' }],
  },
  logoText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  activeMenu: {
    borderLeftColor: '#FF6B35',
    backgroundColor: '#fff7f2',
  },
  linkText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  activeText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});
