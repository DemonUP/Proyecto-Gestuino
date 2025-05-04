// App.js
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [screen, setScreen] = useState('login');

  if (screen === 'home') return <HomeScreen onLogout={() => setScreen('login')} />;
  if (screen === 'register') return <RegisterScreen onGoBack={() => setScreen('login')} />;

  return (
    <LoginScreen
      onLogin={() => setScreen('home')}
      onGoToRegister={() => setScreen('register')}
    />
  );
}
