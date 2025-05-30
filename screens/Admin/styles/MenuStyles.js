import { StyleSheet, Dimensions } from 'react-native';

const isMobile = Dimensions.get('window').width < 700;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
  },
  wrapperMobile: {
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    marginLeft: isMobile ? 0 : 40,
    marginRight: isMobile ? 0 : 40,
    backgroundColor: '#fafafa',
  },
  mainContentMobile: {
    marginLeft: 0,
    marginRight: 0,
    padding: 8,
  },
  contentContainer: {
    padding: isMobile ? 8 : 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  newButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  newButtonMobile: {
    width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 12,
  },
  newButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainerMobile: {
    padding: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inputMobile: {
    paddingHorizontal: 8,
    fontSize: 16,
  },
  inputCantidad: {
    width: 60,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 6,
    marginLeft: 8,
  },
  inputCantidadMobile: {
    width: '100%',
    marginLeft: 0,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  precioTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  filaPrecio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filaActivo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelActivo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
    width: 180,
  },
  primaryBtnMobile: {
    width: '100%',
    alignSelf: 'stretch',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dangerBtn: {
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: 120,
  },
  dangerBtnMobile: {
    width: '100%',
    alignSelf: 'stretch',
  },
  dangerBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollIngredientes: {
    maxHeight: 150,
    marginBottom: 12,
  },
  filaIngrediente: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientName: {
    flex: 1,
    color: '#333',
  },
  ingredientsContainer: {
    paddingTop: 8,
  },
  ingredientLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    color: '#4b5563',
  },
  bullet: {
    marginRight: 6,
    color: '#4b5563',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    width: '48%',
    marginHorizontal: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 180,
    maxWidth: 420,
    flex: 1,
  },
  cardMobile: {
    width: '100%',
    minWidth: '100%',
    marginHorizontal: 0,
  },
  cardHover: {
    transform: [{ translateY: -3 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderColor: '#FF6B35',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginLeft: 8,
  },
  actionBtnHover: {
    transform: [{ scale: 1.05 }],
  },
  deleteBtnHover: {
    transform: [{ scale: 1.05 }],
  },
  actionText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});
