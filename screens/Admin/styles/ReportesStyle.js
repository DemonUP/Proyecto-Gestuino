import { StyleSheet, Dimensions, Platform } from 'react-native';

const isMobile = Dimensions.get('window').width < 700;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: '#fff5f5',
  },
  wrapperMobile: { flexDirection: 'column' },

  mainContent: {
    flex: 1,
    padding: 20,
  },
  mainContentMobile: {
    padding: 8,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff5f5',
    flex: 1,
  },
  containerMobile: {
    padding: 8,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageTitleMobile: { fontSize: 18 },
  pageSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  pageSubtitleMobile: { fontSize: 12 },

  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  // Responsive row para las tarjetas destacadas
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },
  headerRowMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  // Highlight Cards
  highlightCard: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    borderRadius: 10,
    padding: 16,
    marginBottom: 0,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  highlightCardMobile: {
    width: '100%',
    marginBottom: 12,
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

  filtrosContainer: {
  backgroundColor: '#fff',
  padding: 16,
  marginVertical: 10,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 9999,
  position: 'relative',
},
label: {
  fontWeight: 'bold',
  marginTop: 10,
  marginBottom: 4,
},
botonLimpiar: {
  marginTop: 12,
  backgroundColor: '#ccc',
  padding: 10,
  borderRadius: 6,
  alignItems: 'center',
},
textoBotonLimpiar: {
  color: '#333',
  fontWeight: 'bold',
},
filtrosContainer: {
  backgroundColor: '#fffdfc',
  padding: 20,
  marginBottom: 20,
  borderRadius: 12,
  borderColor: '#f5d6cb',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  zIndex: 1000,
  position: 'relative',
},

label: {
  fontWeight: 'bold',
  marginBottom: 6,
  color: '#b22222',
},

botonLimpiar: {
  marginTop: 16,
  backgroundColor: '#ffe0d1',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 8,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  elevation: 2,
},

textoBotonLimpiar: {
  color: '#b22222',
  fontWeight: 'bold',
},


});


