import { useEffect, useState } from 'react';
import supabase from '../../../supabase';
import { verificarDisponibilidad } from '../../Admin/controllers/InventarioController';

export function useMenuController() {
  const [productos, setProductos] = useState([]);
  const [faltantes, setFaltantes] = useState({});

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*');

    if (error) {
      console.error('Error cargando productos:', error);
      return;
    }

    setProductos(data);

    const nuevoFaltantes = {};
    for (const producto of data) {
      const faltan = await obtenerIngredientesFaltantes(producto.id);
      if (faltan.length > 0) {
        nuevoFaltantes[producto.id] = faltan;
      }
    }
    setFaltantes(nuevoFaltantes);
  };

  const toggleActivo = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('productos')
      .update({ activo: nuevoEstado })
      .eq('id', id);

    if (error) {
      console.error('Error actualizando estado:', error);
    } else {
      cargarProductos();
    }
  };

  const actualizarPrecio = async (id, nuevoPrecio) => {
    const precioNumerico = parseFloat(nuevoPrecio);
    if (isNaN(precioNumerico) || precioNumerico < 0) return;

    const { error } = await supabase
      .from('productos')
      .update({ precio: precioNumerico })
      .eq('id', id);

    if (error) {
      console.error('Error actualizando precio:', error);
    } else {
      cargarProductos();
    }
  };

  return {
    productos,
    faltantes,
    toggleActivo,
    actualizarPrecio
  };
}

export async function obtenerIngredientesFaltantes(productoId) {
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
    console.error('Error al verificar ingredientes faltantes:', error);
    return [];
  }

  const faltantes = data
    .filter(i => i.ingredientes.stock < i.cantidad)
    .map(i => i.ingredientes.nombre);

  return faltantes;
}
