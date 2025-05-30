// MeseroHomeStyles.js
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
    padding: isMobile ? 16 : 32,
  },

  /** Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  logoutBtnMobile: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'stretch',
  },

  /** Estadísticas */
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,

    // 📱 Responsivo: ajusta a móvil y PC
    width: isMobile ? '100%' : 400,
    minWidth: isMobile ? '100%' : 360,
    maxWidth: isMobile ? '100%' : 440,
    alignSelf: 'center',
  },

  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#2D3748',
  },

  /** Mesas */
  tablesSection: {
    marginTop: 24,
  },
  cardHeader: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    marginBottom: 16,
    gap: isMobile ? 12 : 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  newButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: isMobile ? 'stretch' : 'auto',
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mesasGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    gap: isMobile ? 12 : 0,
  },
  mesaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: isMobile ? '95%' : 220,
    maxWidth: isMobile ? '100%' : 330,
    width: isMobile ? '95%' : 300,
    alignSelf: isMobile ? 'center' : 'auto',
    marginRight: isMobile ? 0 : 16,
  },
  mesaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mesaNumero: {
    fontWeight: '600',
    color: '#2D3748',
  },
  mesaEstado: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    color: '#2D3748',
  },
  mesaEstadoActiva: {
    backgroundColor: '#48BB78',
    color: '#FFFFFF',
  },
  pedidoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    color: '#2D3748',
  },
});
