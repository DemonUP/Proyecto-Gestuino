import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
  Switch,
  Dimensions,
} from 'react-native';
import { useMenuController } from '../controllers/MenuController';
import AdminSidebar from '../../../components/AdminSidebar';
import styles from '../styles/MenuStyles';

const isMobile = Dimensions.get('window').width < 600;

export default function MenuScreen() {
  const {
    productos,
    faltantes,
    ingredientes,
    crearProducto,
    crearIngrediente,
    editarProducto,
    toggleActivo,
    obtenerRelaciones,
  } = useMenuController();

  const [showForm, setShowForm] = useState(false);
  const [showIngForm, setShowIngForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNombre, setNewNombre] = useState('');
  const [newPrecio, setNewPrecio] = useState('');
  const [newDescripcion, setNewDescripcion] = useState('');
  const [selectedIngredientes, setSelectedIngredientes] = useState([]);
  const [newIngName, setNewIngName] = useState('');
  const [newIngStock, setNewIngStock] = useState('');
  const [deletedIds, setDeletedIds] = useState([]);

  const visibleProductos = productos.filter(
    p => p.activo && !deletedIds.includes(p.id)
  );

  const confirmDelete = id =>
    Alert.alert('Confirmar ocultación', '¿Ocultar este platillo de la vista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Ocultar',
        style: 'destructive',
        onPress: () => setDeletedIds(prev => [...prev, id]),
      },
    ]);

  const handleEdit = async item => {
    setEditingId(item.id);
    setNewNombre(item.nombre);
    setNewPrecio(item.precio.toString());
    setNewDescripcion(item.descripcion || '');
    const { data: rels } = await obtenerRelaciones(item.id);
    setSelectedIngredientes(
      ingredientes
        .map(i => {
          const rel = rels.find(r => r.ingrediente_id === i.id);
          return rel ? { id: i.id, cantidad: rel.cantidad } : null;
        })
        .filter(x => x)
    );
    setShowIngForm(false);
    setShowForm(true);
  };

  const handleCantidadChange = (id, cantidad) =>
    setSelectedIngredientes(prev => {
      if (cantidad <= 0) return prev.filter(i => i.id !== id);
      const exists = prev.find(i => i.id === id);
      if (exists) {
        return prev.map(i => (i.id === id ? { ...i, cantidad } : i));
      }
      return [...prev, { id, cantidad }];
    });

  const handleSubmitPlatillo = async () => {
    if (!newNombre || !newPrecio || selectedIngredientes.length === 0) {
      return Alert.alert('Error', 'Completa todos los campos');
    }
    const payload = {
      nombre: newNombre,
      precio: newPrecio,
      descripcion: newDescripcion,
      ingredientesSeleccionados: selectedIngredientes,
    };
    if (editingId) {
      await editarProducto({ id: editingId, ...payload });
    } else {
      await crearProducto(payload);
    }
    setShowForm(false);
    setEditingId(null);
    setNewNombre('');
    setNewPrecio('');
    setNewDescripcion('');
    setSelectedIngredientes([]);
  };

  const handleSubmitIngrediente = async () => {
    if (!newIngName || !newIngStock) {
      return Alert.alert('Error', 'Completa nombre y stock');
    }
    await crearIngrediente({ nombre: newIngName, stock: newIngStock });
    setShowIngForm(false);
    setNewIngName('');
    setNewIngStock('');
  };

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
      <Pressable style={styles.primaryBtn} onPress={handleSubmitIngrediente}>
        <Text style={styles.primaryBtnText}>Guardar Ingrediente</Text>
      </Pressable>
      <Pressable style={styles.dangerBtn} onPress={() => setShowIngForm(false)}>
        <Text style={styles.dangerBtnText}>Cancelar</Text>
      </Pressable>
    </View>
  );

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
      <TextInput
        placeholder="Descripción"
        value={newDescripcion}
        onChangeText={setNewDescripcion}
        style={styles.input}
      />
      <Text style={styles.label}>Ingredientes:</Text>
      <ScrollView style={styles.scrollIngredientes}>
        {ingredientes.map(i => (
          <View key={i.id} style={styles.filaIngrediente}>
            <Text style={styles.ingredientName}>
              {i.nombre} (Stock: {i.stock})
            </Text>
            <TextInput
              placeholder="0"
              value={
                selectedIngredientes.find(si => si.id === i.id)?.cantidad?.toString() ||
                ''
              }
              keyboardType="numeric"
              style={styles.inputCantidad}
              onChangeText={t => handleCantidadChange(i.id, parseInt(t) || 0)}
            />
          </View>
        ))}
      </ScrollView>
      <Pressable style={styles.primaryBtn} onPress={() => setShowIngForm(true)}>
        <Text style={styles.primaryBtnText}>+ Añadir Ingrediente</Text>
      </Pressable>
      <Pressable style={styles.primaryBtn} onPress={handleSubmitPlatillo}>
        <Text style={styles.primaryBtnText}>
          {editingId ? 'Guardar Cambios' : 'Guardar Platillo'}
        </Text>
      </Pressable>
      <Pressable style={styles.dangerBtn} onPress={() => setShowForm(false)}>
        <Text style={styles.dangerBtnText}>Cancelar</Text>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => (
  <Pressable style={({ hovered }) => [styles.card, hovered && styles.cardHover]}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.nombreProducto}>{item.nombre}</Text>
        {item.descripcion?.trim() !== '' && (
          <Text style={styles.descripcionTexto}>Descripción: {item.descripcion}</Text>
        )}
        <View style={styles.filaPrecio}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.precioTexto}>
            {item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
          </Text>
        </View>
        <View style={styles.filaActivo}>
          <Text style={styles.labelActivo}>Activo:</Text>
          <Switch value={item.activo} onValueChange={val => toggleActivo(item.id, val)} />
        </View>
      </View>
      <View style={styles.actionRow}>
        <Pressable
          style={({ hovered }) => [styles.actionBtn, hovered && styles.actionBtnHover]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionText}>EDITAR</Text>
        </Pressable>
      </View>
    </View>
    {faltantes[item.id]?.length > 0 && (
      <View style={styles.ingredientsContainer}>
        {faltantes[item.id].map((ing, idx) => (
          <Text key={idx} style={styles.ingredientLine}>● {ing}</Text>
        ))}
      </View>
    )}
  </Pressable>
);

  return (
    <View style={styles.wrapper}>
      {!isMobile && <AdminSidebar />}
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Menú</Text>
            <Text style={styles.headerSubtitle}>Menú del Restaurante</Text>
          </View>
          {!showForm && (
            <Pressable style={styles.newButton} onPress={() => setShowForm(true)}>
              <Text style={styles.newButtonText}>+ Nuevo Plato</Text>
            </Pressable>
          )}
        </View>

        {showIngForm
          ? renderIngredienteForm()
          : showForm
            ? renderFormPlatillo()
            : (
              <FlatList
                data={visibleProductos}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                numColumns={isMobile ? 1 : 2}
                columnWrapperStyle={!isMobile && { justifyContent: 'space-between' }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No hay productos registrados.</Text>
                }
              />
            )}
      </ScrollView>
    </View>
  );
}