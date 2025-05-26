import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://qsjybubtwjxzncbmayyh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzanlidWJ0d2p4em5jYm1heXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTQ3MTQsImV4cCI6MjA2MTk3MDcxNH0.3YQgwcXhSEwjT8jTwxMVvDL8mNZgzzbpkbODUiAGAlc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Función para login (seguridad reforzada sin cambiar lógica)
export async function loginUsuario(correo, contrasena) {
  // Validación estricta
  if (!correo || !contrasena || correo.trim() === '' || contrasena.trim() === '') {
    return { success: false, message: 'Debe ingresar correo y contraseña' };
  }

  const patronPeligroso = /[;'"\s]/; // Evita caracteres peligrosos
  if (patronPeligroso.test(correo) || patronPeligroso.test(contrasena)) {
    return { success: false, message: 'Los datos ingresados tienen formato inválido' };
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, gmail, id_rol, roles (nombre)')
      .eq('gmail', correo)
      .eq('contrasena', contrasena)
      .single();

    if (error || !data) {
      return { success: false, message: 'Credenciales inválidas' };
    }

    const user = {
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.gmail,
      rol: data.roles?.nombre ?? 'desconocido',
    };

    await guardarUsuarioEnSesion(user);

    return { success: true, user };

  } catch (e) {
    console.error('Error interno en loginUsuario', e);
    return { success: false, message: 'Error del servidor. Intente nuevamente' };
  }
}

// ✅ Guardar usuario en AsyncStorage
export async function guardarUsuarioEnSesion(usuario) {
  try {
    await AsyncStorage.setItem('usuario_sesion', JSON.stringify(usuario));
  } catch (e) {
    console.error('Error guardando usuario en sesión', e);
  }
}

// ✅ Obtener usuario desde AsyncStorage
export async function obtenerUsuarioDeSesion() {
  try {
    const json = await AsyncStorage.getItem('usuario_sesion');
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error leyendo usuario en sesión', e);
    return null;
  }
}

export default supabase;


export async function obtenerVentasHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const isoHoy = hoy.toISOString();

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      cantidad,
      productos (precio)
    `)
    .gte('creado_en', isoHoy);

  if (error) {
    console.error('Error obteniendo ventas de hoy:', error);
    return 0;
  }

  const total = data.reduce((acc, p) => {
    const precio = p.productos?.precio || 0;
    return acc + p.cantidad * precio;
  }, 0);

  return total;
}

export async function obtenerOcupacionMesas() {
  const { data, error } = await supabase
    .from('mesas')
    .select('id, estado');

  if (error) {
    console.error('Error obteniendo mesas:', error);
    return { ocupadas: 0, total: 0 };
  }

  const ocupadas = data.filter(m => {
    const estado = m.estado?.toLowerCase();
    return estado === 'ocupada' || estado === 'cerrada';
  }).length;

  const total = data.length;

  return { ocupadas, total };
}



export async function obtenerInventarioCritico() {
  const { data, error } = await supabase
    .from('ingredientes')
    .select('nombre, stock')
    .lt('stock', 5);

  if (error) {
    console.error('Error obteniendo inventario crítico:', error);
    return [];
  }

  return data;
}
// 📦 Total de pedidos activos
export async function obtenerPedidosActivos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id')
    .eq('estado', 'activo'); // Asegúrate que el campo existe

  if (error) {
    console.error('Error obteniendo pedidos activos:', error);
    return 0;
  }

  return data.length;
}

// 🍽️ Total de mesas ocupadas o cerradas
export async function obtenerMesasActivas() {
  const { data, error } = await supabase
    .from('mesas')
    .select('id, estado');

  if (error) {
    console.error('Error obteniendo mesas activas:', error);
    return 0;
  }

  const activas = data.filter(m =>
    ['ocupada', 'cerrada'].includes(m.estado?.toLowerCase())
  );

  return activas.length;
}

export async function obtenerPropinasHoy() {
  // 1. Obtener porcentaje de propina desde configuraciones
  const { data: config, error: configError } = await supabase
    .from('configuraciones')
    .select('*');

  if (configError) {
    console.error('Error cargando configuración de propina:', configError);
    return 0;
  }

  const propinaPorcentaje = parseFloat(
    config.find((c) => c.nombre === 'propina')?.valor || 0
  );

  // 2. Calcular total de ventas facturadas de hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const isoHoy = hoy.toISOString();

  const { data: pedidos, error: pedidosError } = await supabase
    .from('pedidos')
    .select(`
      cantidad,
      productos (precio)
    `)
    .eq('estado', 'facturado')
    .gte('creado_en', isoHoy);

  if (pedidosError) {
    console.error('Error cargando ventas del día:', pedidosError);
    return 0;
  }

  const subtotal = pedidos.reduce((acc, pedido) => {
    const precio = pedido.productos?.precio || 0;
    return acc + pedido.cantidad * precio;
  }, 0);

  // 3. Calcular propina
  const propina = subtotal * (propinaPorcentaje / 100);
  return propina;
}

export async function obtenerVentasPorHora() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const isoHoy = hoy.toISOString();

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      creado_en,
      cantidad,
      producto_id,
      productos (
        id,
        precio
      )
    `)
    .eq('estado', 'facturado')
    .gte('creado_en', isoHoy);

  if (error) {
    console.error('❌ Error cargando ventas por hora:', error);
    return [];
  }

  const ventasPorHora = {};

  for (const pedido of data) {
    if (!pedido.creado_en || !pedido.productos?.precio) continue;

    const hora = new Date(pedido.creado_en).getHours();
    const bloque = `${hora.toString().padStart(2, '0')}:00`;
    const total = pedido.cantidad * pedido.productos.precio;

    if (!ventasPorHora[bloque]) {
      ventasPorHora[bloque] = 0;
    }

    ventasPorHora[bloque] += total;
  }

  return Object.entries(ventasPorHora)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([hora, total]) => ({ hora, total }));
}
