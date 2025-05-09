// styles/MenuStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf4',
    padding: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#b03a2e',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff5ee',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  filaPrecio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginRight: 8,
  },
  inputPrecio: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    backgroundColor: '#fff',
  },
  faltantesContainer: {
    marginTop: 10,
  },
  etiquetaFaltan: {
    color: '#c0392b',
    fontWeight: 'bold',
  },
  ingredienteFaltante: {
    marginLeft: 10,
    color: '#e74c3c',
  },
  filaActivo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  labelActivo: {
    fontSize: 14,
    marginRight: 8,
    color: '#555',
  },
});
