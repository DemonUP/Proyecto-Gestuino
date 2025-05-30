import { StyleSheet, Dimensions, Platform } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
  },
  // Responsive: columna en mobile
  wrapperMobile: { flexDirection: 'column' },

  mainContent: {
    flex: 1,
    padding: 40,
  },
  mainContentMobile: {
    flex: 1,
    padding: 12,
  },

  container: {
    paddingBottom: 32,
  },
  containerMobile: {
    paddingBottom: 16,
  },

  // Header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageTitleMobile: {
    fontSize: 18,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  pageSubtitleMobile: {
    fontSize: 12,
  },

  // Top Section
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // Stack en mobile
  topSectionMobile: {
    flexDirection: 'column',
    gap: 12,
  },

  cardBase: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardWide: { width: '60%' },
  cardNarrow: { width: '35%' },
  cardFull: { width: '100%', marginBottom: 16 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconBg: {
    backgroundColor: '#FFECDC',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  cardIconBgLight: {
    backgroundColor: '#FFECDC',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  // Form Grid
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  formGridMobile: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  formItem: {
    width: '48%',
    marginBottom: 12,
  },
  formItemMobile: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  timeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },

  // Stats
  statsList: {
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  statItemAccent: {
    backgroundColor: '#FFF4EC',
  },
  statLabel: {
    fontSize: 14,
    color: '#374151',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  statValueAccent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // Lista de Meseros
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBg: {
    backgroundColor: '#FFECDC',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF6B35',
    marginRight: 12,
  },
  newButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // centra el contenido horizontalmente
  backgroundColor: '#FF6B35',
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginTop: 16,
  alignSelf: 'flex-start', // por defecto (solo para escritorio)
},
newButtonMobile: {
  width: '100%',
  alignSelf: 'stretch', // estira el botón al ancho del contenedor
},
newButtonText: {
  color: '#FFF',
  marginLeft: 8,
  fontSize: 16,
  fontWeight: '600',
},

});

