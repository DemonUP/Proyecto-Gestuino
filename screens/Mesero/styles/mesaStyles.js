import { StyleSheet, Dimensions } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: isMobile ? 'column' : 'row',
    backgroundColor: '#F7FAFC',
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  headerIconContainer: {
    backgroundColor: '#E55A1B',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#3b3b3b',
    marginTop: 2,
  },

  // Grid de mesas
  mesasGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'center' : 'space-between',
    gap: isMobile ? 12 : 16,
  },
mesaCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  paddingVertical: isMobile ? 16 : 20,
  paddingHorizontal: 20,
  borderWidth: 2,
  borderColor: '#E2E8F0',
  marginBottom: 16,
  width: isMobile ? '100%' : '48%',
  alignSelf: isMobile ? 'center' : 'auto',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  minHeight: isMobile ? 140 : undefined, // altura mínima para móviles
  justifyContent: 'space-between',      // distribuye verticalmente contenido
},

  mesaCardOcupada: {
    borderColor: '#FF6B35',
  },
  mesaNumero: {
    fontSize: isMobile ? 20 : 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  mesaEstado: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    textTransform: 'uppercase',
    marginTop: 8,
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },
  mesaEstadoOcupada: {
    color: '#C53030',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  pedidoItem: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
    textAlign: 'center',
    marginVertical: 16,
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#FF6B35',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: '#E2E8F0',
  },
  btnSecondaryText: {
    color: '#2D3748',
    fontWeight: '600',
  },
});
