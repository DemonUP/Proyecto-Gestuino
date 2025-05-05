import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import AdminHome from './screens/Admin/AdminHome';

import MeseroHome from './screens/Mesero/MeseroHome';
import MesaScreen from './screens/Mesero/screens/MesaScreen';
import PedidoScreen from './screens/Mesero/screens/PedidoScreen';
import FacturaScreen from './screens/Mesero/screens/FacturaScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <LoginScreen onLogin={(user) => setUsuario(user)} />;
  }

  if (usuario.rol === 'admin') {
    return <AdminHome usuario={usuario} onLogout={() => setUsuario(null)} />;
  }

  if (usuario.rol === 'mesero') {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MeseroHome"
          screenOptions={({ navigation }) => ({
            headerRight: () => (
              <Ionicons
                name="home-outline"
                size={24}
                color="black"
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('MeseroHome')}
              />
            ),
          })}
        >
          <Stack.Screen name="MeseroHome" options={{ title: 'Inicio Mesero' }}>
            {(props) => (
              <MeseroHome
                {...props}
                usuario={usuario}
                onLogout={() => setUsuario(null)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Mesas" component={MesaScreen} />
          <Stack.Screen name="Pedido" component={PedidoScreen} />
          <Stack.Screen name="Factura" component={FacturaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return <LoginScreen onLogin={(user) => setUsuario(user)} />;
}
