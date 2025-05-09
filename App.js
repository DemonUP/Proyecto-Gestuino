import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';

import AdminHome from './screens/Admin/AdminHome';
import RolesScreen from './screens/Admin/screens/RolesScreen';
import ReportesScreen from './screens/Admin/screens/ReportesScreen';
import InventarioScreen from './screens/Admin/screens/InventarioScreen';
import GraficosReportes from './screens/Admin/screens/GraficosReportes';
import MenuScreen from './screens/Admin/screens/MenuScreen';
import ConfiguracionesScreen from './screens/Admin/screens/ConfiguracionesScreen'; 


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

  // LOGIN
  if (!usuario) {
    return <LoginScreen onLogin={(user) => setUsuario(user)} />;
  }

  return (
    <NavigationContainer>
      {usuario.rol === 'admin' ? (
        <Stack.Navigator
        initialRouteName="AdminHome"
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <Ionicons
              name="home-outline"
              size={24}
              color="black"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('AdminHome')}
            />
          ),
        })}
      >
        <Stack.Screen name="AdminHome" options={{ title: 'Inicio Administrador' }}>
          {(props) => (
            <AdminHome
              {...props}
              usuario={usuario}
              onLogout={() => setUsuario(null)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Roles" component={RolesScreen} />
        <Stack.Screen name="Reportes" component={ReportesScreen} />
        <Stack.Screen name="GraficosReportes" component={GraficosReportes} />
        <Stack.Screen name="Inventario" component={InventarioScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Configuraciones" component={ConfiguracionesScreen} />
      </Stack.Navigator>      
      ) : (
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
      )}
    </NavigationContainer>
  );
}
