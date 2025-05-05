# Gestuino - Gestor de Restaurante

Aplicación móvil para gestión de pedidos y mesas en un restaurante. Diseñada para meseros, con enfoque en simplicidad, rapidez y control de flujo de atención. Usa Supabase para la base de datos y Expo para el frontend.

---

## Estructura del Proyecto

```
gestuino/
├── views/               # Pantallas (LoginScreen.js, MesaScreen.js, etc.)
├── controllers/         # Lógica (PedidoController.js, etc.)
├── styles/              # Estilos modulares por pantalla
├── supabase/            # API (api.js)
├── assets/              # (Opcional) Recursos estáticos
├── App.js               # Punto de entrada
└── package.json
```

---

## Instalación

### Requisitos

- Tener **Expo** instalado  
- Tener **Node.js** instalado

### Instalación de dependencias

```bash
npm i
```

---

## Ejecución del proyecto

```bash
npx expo start
```

---

## Funcionalidades principales

- Login con Supabase
- Vista de mesas (estado: disponible/ocupada)
- Gestión de pedidos por mesa (agregar, eliminar productos)
- Generación de factura por mesa
- Cierre de cuenta (liberar mesa)
- Separación visual entre pantallas móviles y de escritorio

---

## 💡 Tecnologías utilizadas

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.com/)
