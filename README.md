# 📌 Gestuino - Sistema de Gestión para Restaurantes

## 📝 Resumen General del Sistema
Gestuino es una aplicación móvil multiplataforma desarrollada en **React Native con Expo**, que permite a los restaurantes gestionar eficientemente mesas, pedidos, menús, inventario, facturación y reportes. Se conecta directamente con una base de datos en Supabase, aprovechando su sistema de autenticación y almacenamiento de datos en tiempo real.

## 🎯 Objetivos del Proyecto

### Objetivo General:
Desarrollar una solución digital integral para la gestión operativa de restaurantes, accesible desde dispositivos móviles, con funcionalidades clave centralizadas en un solo sistema.

### Objetivos Específicos:
- Implementar una interfaz amigable y responsiva para meseros, administradores y chefs.
- Automatizar la gestión de pedidos, disponibilidad de mesas y facturación.
- Facilitar el control de inventario y recetas según demanda.
- Generar reportes de ventas agrupados por mesa, usuario o fecha.

## 📌 Alcance Funcional del Sistema

### Módulos:
- Autenticación y gestión de usuarios.
- Gestión de mesas.
- Registro y seguimiento de pedidos.
- Visualización del menú y gestión de recetas.
- Inventario automático de ingredientes.
- Facturación y cierre de cuenta.
- Reportes y estadísticas.

### Roles y Permisos:
- **Administrador:** Acceso total al sistema, configuración y reportes.
- **Mesero:** Gestión de mesas, toma de pedidos, generación de facturas.
## 💻 Tecnologías Utilizadas

### Frontend (App móvil):
- React Native con Expo
- React Navigation
- AsyncStorage
- Context API

### Backend (servicio):
- Supabase
  - Supabase Auth
  - Supabase Database
  - Supabase Storage

### Base de Datos:
- PostgreSQL (gestionado por Supabase)

### Librerías Adicionales:
- react-native-paper / react-native-elements
- uuid, dayjs
- @supabase/supabase-js

## 🏗 Arquitectura del Sistema
- Cliente-Servidor
- API REST directa vía Supabase
- Patrón de diseño: MVC modularizado por pantalla

## 📁 Estructura del Código

```
Gestuino/
├── controllers/
├── screens/
├── styles/
├── supabase.js
├── App.js
└── assets/
```

## 🔄 Flujo de Desarrollo
1. Diseño (Figma)
2. Desarrollo modular
3. Testing funcional
4. Integración con Supabase
5. Despliegue con Expo Go y APK

## 🔐 Autenticación y Control de Sesión
- Supabase auth con correo + contraseña
- Sesión guardada en AsyncStorage
- Hook de sesión activa
- Cierre con signOut()

## 🧭 Descripción de Pantallas

- **LoginScreen:** Inicio de sesión.
- **RolesScreen:** Selección de rol.
- **MesasScreen:** Gestión de mesas.
- **PedidoScreen:** Gestión de productos.
- **MenuScreen:** Recetas, precios y faltantes.
- **FacturaScreen:** Cierre de cuenta.
- **ReportesScreen:** Ventas agrupadas.

## ❗ Manejo de Errores y Validaciones
- Validación de campos y formatos
- Captura de errores de Supabase
- Fallbacks ante errores de conexión

## 🗃 Modelo de Base de Datos

- **usuarios**, **mesas**, **productos**, **ingredientes**, **recetas**, **pedidos**, **ventas**
- Relaciones entre productos e ingredientes
- Pedidos vinculados a mesas
- Ventas agrupan pedidos

## 🚀 Control de Versiones y Despliegue
- Repositorio GitHub con ramas por módulo
- Commits por funcionalidad
- Expo build para APK
- Supabase gestionado online

## ✅ Testing y Control de Calidad
- Pruebas manuales por pantalla
- Validación de flujos
- Simulación de errores
- Feedback real

## ⚠️ Limitaciones y Mejoras Futuras

### Limitaciones:
- Sin notificaciones push
- Sin vista cliente aún
- No bloquea doble ingreso

### Mejoras:
- Integración de pagos
- Promociones y combos
- Reservas de mesas

## Instalacion

```
npm install

npx expo start 


```


## 🧩 Conclusiones
Gestuino demostró ser una solución completa, funcional y escalable. Supabase permitió centrarse en la lógica sin preocuparse por el backend.
