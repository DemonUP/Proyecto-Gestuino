// supabase.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://qsjybubtwjxzncbmayyh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzanlidWJ0d2p4em5jYm1heXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTQ3MTQsImV4cCI6MjA2MTk3MDcxNH0.3YQgwcXhSEwjT8jTwxMVvDL8mNZgzzbpkbODUiAGAlc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Función para login
export async function loginUsuario(correo, contrasena) {
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
