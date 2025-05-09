import { StyleSheet } from 'react-native';

export const webToastStyle = {
  position: 'fixed',
  bottom: '70px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#c0392b',
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
    padding: 20,
    backgroundColor: '#e89993',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 5,
  },
  item: {
    backgroundColor: '#fdd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
    borderRadius: 5,
  },
  delete: {
    color: 'red',
    fontWeight: 'bold',
  },
  botonRojo: {
    backgroundColor: '#a94442',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
