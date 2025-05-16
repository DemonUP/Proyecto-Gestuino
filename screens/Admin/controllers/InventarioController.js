import supabase from '../../../supabase';

/**
 * Verifica si hay suficiente stock para preparar la cantidad indicada de un producto.
 * @param {number} productoId - ID del producto del menú.
 * @param {number} cantidad - Cantidad total que se desea preparar (por defecto 1).
 * @returns {Promise<{disponible: boolean, faltantes?: Array}>}
 */
export async function verificarDisponibilidad(productoId, cantidad = 1) {
  const { data, error } = await supabase
    .from('productos_ingredientes')
    .select(`
      ingrediente_id,
      cantidad,
      ingredientes:ingrediente_id (
        nombre,
        stock
      )
    `)
    .eq('producto_id', productoId);

  if (error) {
    console.error('Error verificando inventario:', error);
    return { disponible: false, faltantes: [] };
  }

  const faltantes = data.filter(i => i.ingredientes.stock < i.cantidad * cantidad)
    .map(i => ({
      nombre: i.ingredientes.nombre,
      requerido: i.cantidad * cantidad,
      disponible: i.ingredientes.stock
    }));

  return {
    disponible: faltantes.length === 0,
    faltantes
  };
}

/**
 * Descuenta del stock los ingredientes necesarios para una cantidad del producto.
 * Usa una función almacenada en Supabase llamada 'descontar_stock'.
 * @param {number} productoId 
 * @param {number} cantidad 
 */
export async function descontarIngredientes(productoId, cantidad = 1) {
  const { data, error } = await supabase
    .from('productos_ingredientes')
    .select('ingrediente_id, cantidad')
    .eq('producto_id', productoId);

  if (error) {
    console.error('Error al obtener ingredientes para descontar:', error);
    return;
  }

  for (const i of data) {
    await supabase.rpc('descontar_stock', {
      ingrediente_id_input: i.ingrediente_id,
      cantidad_input: i.cantidad * cantidad
    });
  }
}

/**
 * Repone (simula llegada desde bodega) los ingredientes del producto usando función RPC.
 */
export async function reponerFaltantes(productoId) {
  const { data, error } = await supabase
    .from('productos_ingredientes')
    .select('ingrediente_id, cantidad')
    .eq('producto_id', productoId);

  if (error) {
    console.error('Error al obtener ingredientes para reponer:', error);
    return;
  }

  for (const i of data) {
    await supabase.rpc('incrementar_stock', {
      ingrediente_id_input: i.ingrediente_id,
      cantidad_input: i.cantidad
    });
  }

}

/**
 * Crea un nuevo ingrediente en inventario.
 * @param {string} nombre
 * @param {number} stock
 */
export async function crearIngrediente({ nombre, stock }) {
  const { data, error } = await supabase
    .from('ingredientes')
    .insert([{ nombre, stock: parseInt(stock, 10) }])
    .select();
  if (error) {
    console.error('Error creando ingrediente:', error);
    return null;
  }
  return data[0];
}
