// supabase.js
import { createClient } from '@supabase/supabase-js';

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
  
    // Devolver solo lo necesario
    return {
      success: true,
      user: {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.gmail,
        rol: data.roles?.nombre ?? 'desconocido',
      },
    };
  }
  
  export default supabase;