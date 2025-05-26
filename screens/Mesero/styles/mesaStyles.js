import { StyleSheet, Dimensions } from 'react-native';

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
    padding: 20,
  },
  mesasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  mesaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    flexBasis: Dimensions.get('window').width < 600
      ? '100%'
      : '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mesaCardOcupada: {
    borderColor: '#FF6B35',
  },
  mesaNumero: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  mesaEstado: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    textTransform: 'uppercase',
  },
  mesaEstadoOcupada: {
    color: '#C53030',
  },

  /* Modal overlay & content */
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
