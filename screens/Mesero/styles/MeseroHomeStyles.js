import { StyleSheet, Dimensions } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 32,
  },

  /* Estadísticas en Sidebar */
  sidebarStats: {
    marginBottom: 24,
  },
  sidebarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Estadísticas principales */
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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

  /* Sección Mesas */
  tablesSection: {
    marginTop: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mesasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
