import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f5',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B0000',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#B22222',
    padding: 10,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
