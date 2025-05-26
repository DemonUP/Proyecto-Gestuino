import { StyleSheet, Dimensions, Platform } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

// Toast web
export const webToastStyle = {
  position: 'fixed',
  bottom: '60px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  zIndex: '9999',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
  opacity: '0',
  transition: 'opacity 0.3s ease',
};

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
  },
  mainContent: {
    flex: 1,
    marginLeft: isMobile ? 0 : 40,
    marginRight: isMobile ? 0 : 40,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTitleContainer: {
    backgroundColor: '#FF6B35',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
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
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
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
  primaryBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dangerBtn: {
    backgroundColor: '#c0392b',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flex: 1,
  },
  itemHover: {
    transform: [{ translateY: -3 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderColor: '#FF6B35',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockLabel: {
    color: '#4b5563',
    marginRight: 8,
  },
  stockValue: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 16,
  },
  filaControles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtnHover: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  actionBtnText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  actionBtnTextHover: {
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    color: '#6b7280',
    fontWeight: '600',
  },
});
