import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 20 },
  mesa: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  mesaText: { fontSize: 18, fontWeight: 'bold' },
  estado: { fontSize: 14, color: '#666' },
  modal: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  total: { fontSize: 18, marginTop: 20 },
  empty: { textAlign: 'center', marginVertical: 20 },
});
