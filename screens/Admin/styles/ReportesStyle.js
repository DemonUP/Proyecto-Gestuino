import { StyleSheet, Dimensions, Platform } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export default StyleSheet.create({
  // Contenedor principal para sidebar + contenido
  wrapper: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: '#fff5f5',
  },

  // ScrollView que envuelve el contenido
  mainContent: {
    flex: 1,
    padding: 20,
  },

  // Contenedor interior con padding
  container: {
    padding: 20,
    backgroundColor: '#fff5f5',
    flex: 1,
  },

  // ─── Header principal ───
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: isMobile ? 18 : 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: isMobile ? 12 : 14,
    color: '#555',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,    
  },

  // ─── Filas de tarjetas ───
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',  // estira todas al mismo alto
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },

  // Título dentro de cada tarjeta
  titulo: {
    fontSize: isMobile ? 14 : 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Highlight Cards
  highlightCard: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    borderRadius: 10,
    padding: 16,
    marginBottom: isMobile ? 12 : 0,
    width: isMobile ? '100%' : '30%',
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  highlightIconContainer: {
    backgroundColor: '#FFEDD5',
    padding: 10,
    borderRadius: 20,
  },
  highlightText: {
    fontSize: isMobile ? 18 : 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  highlightSubtext: {
    fontSize: isMobile ? 12 : 14,
    color: '#555',
    marginTop: 4,
  },

  // Botones de acción
  botonesTop: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  botonCuadrado: {
    width: 44,
    height: 44,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconoBoton: {
    color: '#fff',
    fontSize: isMobile ? 20 : 22,
  },

  // Popup de filtros (calendario web)
  filtroPopup: {
    position: 'absolute',
    right: 20,
    top: isMobile ? 90 : 100,
    backgroundColor: '#fff',
    padding: isMobile ? 8 : 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
    flexDirection: 'row',
    gap: 8,
    transform: [{ scale: isMobile ? 0.9 : 1 }],
  },

  // Filas de mesas y ventas
  mesaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff7f2',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mesaBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  ventaRow: {
    backgroundColor: '#fffaf0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  ventaTexto: {
    fontSize: isMobile ? 12 : 14,
    color: '#333',
  },
  ventaTotal: {
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 4,
  },
});
