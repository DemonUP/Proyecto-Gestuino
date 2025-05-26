import { StyleSheet, Dimensions } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fffaf2',
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
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconContainer: {
    backgroundColor: '#FF6B35',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a2c2a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c4c4b',
    marginTop: 4,
  },
  configCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  configCardHover: {
    transform: [{ translateY: -3 }],
    shadowOpacity: 0.2,
    borderColor: '#FF6B35',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6c4c4b',
  },
  inputWrapper: {
    position: 'relative',
  },
  configInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  configInputFocus: {
    borderColor: '#FF6B35',
  },
  percentIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    color: '#666',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnHover: {
    transform: [{ scale: 1.02 }],
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
