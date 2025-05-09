// controllers/ConfiguracionController.js
import supabase from '../../../supabase';

// Obtiene las configuraciones de IVA y propina
export async function obtenerConfiguraciones() {
  const { data, error } = await supabase
    .from('configuraciones')
    .select('*');

  if (error) {
    console.error('Error al cargar configuraciones:', error);
    return { iva: 0, propina: 0 };
  }

  const config = { iva: 0, propina: 0 };
  data.forEach(cfg => {
    if (cfg.nombre === 'iva') config.iva = parseFloat(cfg.valor);
    if (cfg.nombre === 'propina') config.propina = parseFloat(cfg.valor);
  });

  return config;
}

// Actualiza una configuración ('iva' o 'propina') con nuevo valor
export async function actualizarConfiguracion(nombre, valor) {
  const { error } = await supabase
    .from('configuraciones')
    .update({ valor })
    .eq('nombre', nombre);

  if (error) {
    console.error(`Error actualizando ${nombre}:`, error);
    return false;
  }

  return true;
}
