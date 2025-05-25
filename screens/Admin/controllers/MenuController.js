// screens/Admin/controllers/MenuController.js

import { useEffect, useState } from 'react';
import supabase from '../../../supabase';

/**
 * Devuelve nombres de ingredientes con stock insuficiente para un producto.
 */
export async function obtenerIngredientesFaltantes(productoId) {
  const { data, error } = await supabase
    .from('productos_ingredientes')
    .select(`
      ingrediente_id,
      cantidad,
      ingredientes:ingrediente_id ( nombre, stock )
    `)
    .eq('producto_id', productoId);

  if (error) {
    console.error('Error verificando faltantes:', error);
    return [];
  }
  return data
    .filter(i => i.ingredientes.stock < i.cantidad)
    .map(i => i.ingredientes.nombre);
}

/**
 * Obtiene las relaciones (ingrediente_id y cantidad) de un platillo.
 */
export async function obtenerRelaciones(productoId) {
  return supabase
    .from('productos_ingredientes')
    .select('ingrediente_id, cantidad')
    .eq('producto_id', productoId);
}

export function useMenuController() {
  const [productos, setProductos] = useState([]);
  const [faltantes, setFaltantes] = useState({});
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    cargarProductos();
    cargarIngredientes();
  }, []);

  async function cargarProductos() {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) {
      console.error('Error cargando productos:', error);
      return;
    }
    setProductos(data);
    // reconstruir faltantes
    const nuevos = {};
    for (const p of data) {
      const f = await obtenerIngredientesFaltantes(p.id);
      if (f.length) nuevos[p.id] = f;
    }
    setFaltantes(nuevos);
  }

  async function cargarIngredientes() {
    const { data, error } = await supabase.from('ingredientes').select('*');
    if (error) {
      console.error('Error cargando ingredientes:', error);
      return;
    }
    setIngredientes(data);
  }

  /** Crea un nuevo ingrediente en inventario */
  async function crearIngrediente({ nombre, stock }) {
    const { error } = await supabase
      .from('ingredientes')
      .insert([{ nombre, stock: parseInt(stock, 10) }]);
    if (error) {
      console.error('Error creando ingrediente:', error);
      return false;
    }
    await cargarIngredientes();
    return true;
  }

  /** Crea un nuevo platillo y sus relaciones */
async function crearProducto({ nombre, precio, ingredientesSeleccionados }) {
  const precioNumerico = parseFloat(precio);
  if (isNaN(precioNumerico) || precioNumerico < 0) {
    console.error('❌ Precio inválido:', precio);
    return null;
  }

  const { data: pd, error: e1 } = await supabase
    .from('productos')
    .insert([{ nombre, precio: precioNumerico, activo: true }])
    .select();

  if (e1) {
    console.error('Error creando producto:', e1);
    return null;
  }

  const newP = pd[0];

  const relacion = ingredientesSeleccionados.map(i => ({
    producto_id: newP.id,
    ingrediente_id: i.id,
    cantidad: i.cantidad,
  }));

  const { error: e2 } = await supabase
    .from('productos_ingredientes')
    .insert(relacion);

  if (e2) console.error('Error vinculando ingredientes:', e2);

  await cargarProductos();
  return newP;
}


  /** Actualiza nombre de un platillo */
  async function actualizarNombre(id, nombre) {
    if (!nombre) return;
    const { error } = await supabase
      .from('productos')
      .update({ nombre })
      .eq('id', id);
    if (error) console.error('Error actualizando nombre:', error);
    else cargarProductos();
  }

  /** Activa o desactiva un platillo */
  async function toggleActivo(id, activo) {
    const { error } = await supabase
      .from('productos')
      .update({ activo })
      .eq('id', id);
    if (error) console.error('Error actualizando estado:', error);
    else cargarProductos();
  }

  /** Actualiza precio de un platillo */
  async function actualizarPrecio(id, precio) {
    const p = parseFloat(precio);
    if (isNaN(p) || p < 0) return;
    const { error } = await supabase
      .from('productos')
      .update({ precio: p })
      .eq('id', id);
    if (error) console.error('Error actualizando precio:', error);
    else cargarProductos();
  }

  /**
   * Edita un platillo existente y reemplaza sus relaciones.
   */
  async function editarProducto({ id, nombre, precio, ingredientesSeleccionados }) {
    const { error: e1 } = await supabase
      .from('productos')
      .update({ nombre, precio: parseFloat(precio) })
      .eq('id', id);
    if (e1) {
      console.error('Error editando producto:', e1);
      return false;
    }
    // elimina relaciones anteriores
    await supabase
      .from('productos_ingredientes')
      .delete()
      .eq('producto_id', id);
    // inserta nuevas
    const relacion = ingredientesSeleccionados.map(i => ({
      producto_id: id,
      ingrediente_id: i.id,
      cantidad: i.cantidad,
    }));
    const { error: e2 } = await supabase
      .from('productos_ingredientes')
      .insert(relacion);
    if (e2) console.error('Error actualizando relaciones:', e2);
    // refresca UI
    await cargarProductos();
    return true;
  }

    /**
   * Elimina un platillo, sus relaciones y opcionalmente ingredientes,
   * y actualiza el estado local para que UI refleje el cambio.
   */
  async function eliminarProducto(id, { borrarInventario = false } = {}) {
    console.log('⏳ Eliminando producto', id);
    // 1) obtén relaciones para posible borrado de inventario
    const { data: rels, error: e0 } = await supabase
      .from('productos_ingredientes')
      .select('ingrediente_id')
      .eq('producto_id', id);
    if (e0) console.error('Error al obtener relaciones:', e0);

    // 2) elimina relaciones
    const { error: e1 } = await supabase
      .from('productos_ingredientes')
      .delete()
      .eq('producto_id', id);
    if (e1) console.error('Error eliminando relaciones:', e1);

    // 3) elimina el producto
    const { error: e2 } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);
    if (e2) {
      console.error('Error eliminando producto:', e2);
      return;
    }
    console.log('✅ Producto eliminado de BD:', id);

    // 4) reflectir en UI inmediatamente
    setProductos(prev => prev.filter(p => p.id !== id));

    // 5) si corresponde, borra ingredientes del inventario
    if (borrarInventario && rels?.length) {
      const ids = rels.map(r => r.ingrediente_id);
      const { error: e3 } = await supabase
        .from('ingredientes')
        .delete()
        .in('id', ids);
      if (e3) console.error('Error eliminando inventario:', e3);
      else {
        console.log('🗑️ Ingredientes eliminados del inventario:', ids);
        setIngredientes(prev => prev.filter(i => !ids.includes(i.id)));
      }
    }
  }


  return {
    productos,
    faltantes,
    ingredientes,
    crearIngrediente,
    crearProducto,
    actualizarNombre,
    toggleActivo,
    actualizarPrecio,
    editarProducto,
    eliminarProducto,
    obtenerRelaciones,
  };
}
