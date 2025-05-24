import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  penguin: {
    width: 40,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    position: 'relative',
  },
  penguinBelly: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 50,
    top: '15%',
    left: '15%',
  },
  penguinBeak: {
    position: 'absolute',
    width: 8,
    height: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 1,
    bottom: '20%',
    right: -4,
    transform: [{ rotate: '-45deg' }],
  },
  logoText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  activeMenu: {
    borderLeftColor: '#FF6B35',
    backgroundColor: '#fff7f2',
  },
  linkText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
});
