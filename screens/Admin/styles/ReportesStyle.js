import { StyleSheet, Dimensions, Platform } from 'react-native';

const isMobile = Dimensions.get('window').width < 600;

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff5f5',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  titulo: {
    fontSize: isMobile ? 18 : 22,
    fontWeight: 'bold',
    color: '#800000',
  },
  totalGeneral: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subInfo: {
    fontSize: isMobile ? 13 : 15,
    color: '#333',
    marginTop: 2,
    fontStyle: 'italic',
  },
  botonesTop: {
    flexDirection: 'row',
    gap: 10,
    marginTop: isMobile ? 10 : 0,
  },
  botonCuadrado: {
    width: isMobile ? 38 : 42,
    height: isMobile ? 38 : 42,
    backgroundColor: '#B22222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  iconoBoton: {
    color: '#fff',
    fontSize: isMobile ? 20 : 22,
  },
  filtroPopup: {
    position: 'absolute',
    right: 20,
    top: isMobile ? 80 : 100,
    backgroundColor: '#fff',
    padding: isMobile ? 8 : 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
    flexDirection: 'row',
    gap: 8,
    transform: [{ scale: isMobile ? 0.9 : 1 }],
  },
  cardMesa: {
    backgroundColor: '#ffe6e6',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  mesaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  mesaTitulo: {
    fontWeight: 'bold',
    fontSize: isMobile ? 14 : 16,
    flex: 1,
  },
  totalMesa: {
    fontWeight: 'bold',
    fontSize: isMobile ? 12 : 14,
    color: '#333',
  },
  ventaItem: {
    backgroundColor: '#ffecec',
    marginBottom: 8,
    borderRadius: 8,
    padding: 10,
  },
  total: {
    fontWeight: 'bold',
    marginTop: 4,
  },
});
