import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Switch,
  StyleSheet,
} from 'react-native';
import { useMenuController } from '../controllers/MenuController';
import styles from '../styles/MenuStyles';

export default function MenuScreen() {
  const {
    productos,
    faltantes,
    ingredientes,
    crearProducto,
    crearIngrediente,
    actualizarNombre,
    toggleActivo,
    actualizarPrecio,
    eliminarProducto,
    editarProducto,       // asumimos que useMenuController lo expone
    obtenerRelaciones,    // para precargar al editar
  } = useMenuController();

  // Estados para formularios
  const [showForm, setShowForm] = useState(false);
  const [showIngForm, setShowIngForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNombre, setNewNombre] = useState('');
  const [newPrecio, setNewPrecio] = useState('');
  const [selectedIngredientes, setSelectedIngredientes] = useState([]);
  const [newIngName, setNewIngName] = useState('');
  const [newIngStock, setNewIngStock] = useState('');

  // Si entramos a editar, precargamos datos
  const handleEdit = async item => {
    setEditingId(item.id);
    setNewNombre(item.nombre);
    setNewPrecio(item.precio.toString());
    // traemos relaciones actuales
    const { data: rels } = await obtenerRelaciones(item.id);
    setSelectedIngredientes(
      ingredientes
        .map(i => {
          const rel = rels.find(r => r.ingrediente_id === i.id);
          return rel ? { id: i.id, cantidad: rel.cantidad } : null;
        })
        .filter(x => x)
    );
    setShowForm(true);
  };

  // Cambiar cantidad de ingrediente
  const handleCantidadChange = (id, cantidad) =>
    setSelectedIngredientes(prev => {
      if (cantidad <= 0) {
        return prev.filter(i => i.id !== id);
      }
      const exists = prev.find(i => i.id === id);
      if (exists) {
        return prev.map(i => (i.id === id ? { ...i, cantidad } : i));
      }
      return [...prev, { id, cantidad }];
    });

  // Guardar creación o edición de platillo
  const handleSubmitPlatillo = async () => {
    if (!newNombre || !newPrecio || selectedIngredientes.length === 0) {
      return Alert.alert('Error', 'Completa todos los campos');
    }
    if (editingId) {
      await editarProducto({
        id: editingId,
        nombre: newNombre,
        precio: newPrecio,
        ingredientesSeleccionados: selectedIngredientes,
      });
    } else {
      await crearProducto({
        nombre: newNombre,
        precio: newPrecio,
        ingredientesSeleccionados: selectedIngredientes,
      });
    }
    // reset
    setShowForm(false);
    setEditingId(null);
    setNewNombre('');
    setNewPrecio('');
    setSelectedIngredientes([]);
  };

  // Guardar nuevo ingrediente
  const handleSubmitIngrediente = async () => {
    if (!newIngName || !newIngStock) {
      return Alert.alert('Error', 'Completa nombre y stock');
    }
    await crearIngrediente({ nombre: newIngName, stock: newIngStock });
    setShowIngForm(false);
    setNewIngName('');
    setNewIngStock('');
  };

  // Confirmar y eliminar platillo (y borrar ingredientes vinculados)
  const confirmDelete = id =>
    Alert.alert('Confirmar eliminación', '¿Eliminar este platillo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await eliminarProducto(id, { borrarInventario: true });
          // opcional: feedback inmediato
          Alert.alert('Eliminado', 'El platillo ha sido eliminado.');
        },
      },
    ]);
    
  // Formulario para nuevo ingrediente
  const renderIngredienteForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Nombre del ingrediente"
        value={newIngName}
        onChangeText={setNewIngName}
        style={styles.input}
      />
      <TextInput
        placeholder="Stock inicial"
        value={newIngStock}
        onChangeText={setNewIngStock}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Guardar Ingrediente" onPress={handleSubmitIngrediente} />
      <Button title="Cancelar" onPress={() => setShowIngForm(false)} color="red" />
    </View>
  );

  // Formulario para crear/editar platillo
  const renderFormPlatillo = () => (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Nombre del platillo"
        value={newNombre}
        onChangeText={setNewNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        value={newPrecio}
        onChangeText={setNewPrecio}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Ingredientes:</Text>
      <ScrollView style={styles.scrollIngredientes}>
        {ingredientes.map(i => (
          <View key={i.id} style={styles.filaIngrediente}>
            <Text>{i.nombre} (Stock: {i.stock})</Text>
            <TextInput
              placeholder="0"
              value={(
                selectedIngredientes.find(si => si.id === i.id)?.cantidad?.toString() ||
                ''
              )}
              keyboardType="numeric"
              style={styles.inputCantidad}
              onChangeText={t => handleCantidadChange(i.id, parseInt(t) || 0)}
            />
          </View>
        ))}
      </ScrollView>

      <Button title="Agregar Ingrediente" onPress={() => setShowIngForm(true)} />
      <Button
        title={editingId ? 'Guardar Cambios' : 'Guardar Platillo'}
        onPress={handleSubmitPlatillo}
      />
      <Button title="Cancelar" onPress={() => setShowForm(false)} color="red" />
    </View>
  );

  // Render de cada platillo en la lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombreProducto}>{item.nombre}</Text>

      <View style={styles.filaPrecio}>
        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.precioTexto}>${item.precio.toFixed(2)}</Text>
      </View>

      {faltantes[item.id]?.length > 0 && (
        <View style={styles.faltantesContainer}>
          <Text style={styles.etiquetaFaltan}>Faltan:</Text>
          {faltantes[item.id].map((ing, idx) => (
            <Text key={idx} style={styles.ingredienteFaltante}>
              • {ing}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.filaActivo}>
        <Text style={styles.labelActivo}>Activo:</Text>
        <Switch
          value={item.activo}
          onValueChange={val => toggleActivo(item.id, val)}
        />
      </View>

      <View style={styles.filaAcciones}>
        <Button title="Editar" onPress={() => handleEdit(item)} />
        <Button title="Eliminar" color="red" onPress={() => confirmDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showForm && <Button title="Agregar Platillo" onPress={() => setShowForm(true)} />}
      {showForm
        ? showIngForm
          ? renderIngredienteForm()
          : renderFormPlatillo()
        : (
          <>
            <Text style={styles.titulo}>Menú del Restaurante</Text>
            <FlatList
              data={productos}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={<Text>No hay productos registrados.</Text>}
            />
          </>
        )}
    </View>
  );
}
