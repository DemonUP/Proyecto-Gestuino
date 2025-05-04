// App.js
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import AdminHome from './screens/AdminHome';
import MeseroHome from './screens/MeseroHome';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <LoginScreen onLogin={(user) => setUsuario(user)} />;
  }

  if (usuario.rol === 'admin') {
    return <AdminHome usuario={usuario} onLogout={() => setUsuario(null)} />;
  }

  if (usuario.rol === 'mesero') {
    return <MeseroHome usuario={usuario} onLogout={() => setUsuario(null)} />;
  }

  // En caso de rol desconocido
  return <LoginScreen onLogin={(user) => setUsuario(user)} />;
}
