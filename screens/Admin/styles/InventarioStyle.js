import { StyleSheet, Dimensions } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export const webToastStyle = {
  position: 'fixed',
  bottom: '60px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '12px',
  paddingLeft: '20px',
  paddingRight: '20px',
  borderRadius: '8px',
  fontSize: '14px',
  zIndex: '9999',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
  opacity: '0',
  transition: 'opacity 0.3s ease',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f5',
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a60000',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#ffe6e6',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    gap: 10,
  },
  filaControles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  stock: {
    color: '#555',
    fontSize: 14,
    marginBottom: isMobile ? 10 : 0,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 120,
  },
  boton: {
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  botonSolicitar: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
