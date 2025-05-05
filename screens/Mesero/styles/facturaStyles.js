import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  toast: {
    position: 'absolute',
    bottom: 150, // <- subido para no interferir con botones
    alignSelf: 'center',
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // para Android
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  total: { marginTop: 30, fontSize: 18, fontWeight: 'bold' },
});
