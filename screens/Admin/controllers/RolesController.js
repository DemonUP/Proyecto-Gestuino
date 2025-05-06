import supabase from '../../../supabase';

export const crearMesero = async ({ nombre, apellido, correo, contrasena, hora_inicio, hora_fin }) => {
  const { error } = await supabase.from('usuarios').insert([
    {
      nombre,
      apellido,
      gmail: correo,
      contrasena,
      id_rol: 2, // mesero
      hora_inicio,
      hora_fin,
      estado: true,
    },
  ]);

  if (error) console.error('Error al crear mesero:', error);
};


export const obtenerMeseros = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, gmail, hora_inicio, hora_fin, estado')
    .eq('id_rol', 2); // Solo meseros

  if (error) {
    console.error('Error al obtener meseros:', error);
    return [];
  }
  return data;
};

export const actualizarEstadoMesero = async (id, nuevoEstado) => {
  const { error } = await supabase
    .from('usuarios')
    .update({ estado: nuevoEstado })
    .eq('id', id);

  if (error) console.error('Error al actualizar estado:', error);
};
