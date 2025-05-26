import { StyleSheet, Dimensions } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
  },
  mainContent: { flex: 1 },
  contentContainer: { padding: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  headerIconContainer: {
    backgroundColor: '#E55A1B',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  headerSubtitle: {
    fontSize: 14,
    color: '#3b3b3b',
    marginTop: 2,
  },

  // Section wrapper
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 14,
    color: '#2D3748',
    marginBottom: 6,
    fontWeight: '600',
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: { height: 44, width: '100%' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },

  // Productos grid
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    flexBasis: isMobile ? '100%' : '48%',
  },
  productName: { fontSize: 16, color: '#2D3748', marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#FF6B35' },

  // Pedido items
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  orderText: { color: '#2D3748', fontSize: 14, flex: 1 },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  quantityInput: {
    width: 50,
    height: 36,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    textAlign: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  deleteBtn: {
    color: '#C53030',
    fontSize: 18,
    fontWeight: '700',
  },

  // Botones
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnPrimary: {
    backgroundColor: '#FF6B35',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnDisabled: {
    backgroundColor: '#E2E8F0',
  },

  btnSecondary: {
    backgroundColor: '#C53030',
  },
});
