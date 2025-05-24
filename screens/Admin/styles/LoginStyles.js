import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  penguin: {
    width: 100,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
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
    width: 20,
    height: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 3,
    bottom: '20%',
    right: -12,
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 4,
  },
  titleG: {
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -12,
  },
  input: {
    width: '100%',
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputFocus: {
    borderColor: '#FF6B35',
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B35',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
