import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  Platform,
  ToastAndroid
} from 'react-native';
import supabase from '../../../supabase';
import { crearIngrediente } from '../controllers/InventarioController';
import styles, { webToastStyle } from '../styles/InventarioStyle';

export default function InventarioScreen() {
  const [ingredientes, setIngredientes] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    obtenerIngredientes();
  }, []);

  const toast = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      const t = document.createElement('div');
      t.textContent = msg;
      Object.entries(webToastStyle).forEach(([k, v]) => (t.style[k] = v));
      document.body.appendChild(t);
      setTimeout(() => (t.style.opacity = '1'), 10);
      setTimeout(() => {
        t.style.opacity = '0';
        setTimeout(() => document.body.removeChild(t), 300);
      }, 3000);
    }
  };

  const obtenerIngredientes = async () => {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .order('nombre', { ascending: true });
    if (error) {
      console.error('Error cargando ingredientes:', error);
      return;
    }
    setIngredientes(data);
  };

  const solicitarABodega = async id => {
    const cantidad = parseInt(cantidades[id], 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }
    const ingrediente = ingredientes.find(i => i.id === id);
    const nuevoStock = ingrediente.stock + cantidad;
    const { error } = await supabase
      .from('ingredientes')
      .update({ stock: nuevoStock })
      .eq('id', id);
    if (error) {
      console.error('Error solicitando a bodega:', error);
      toast('Error al solicitar a bodega');
    } else {
      toast('Solicitado a bodega');
      setCantidades({ ...cantidades, [id]: '' });
      obtenerIngredientes();
    }
  };

  const handleCreateIngrediente = async () => {
    if (!newName || !newStock) {
      Alert.alert('Error', 'Completa nombre y stock');
      return;
    }
    const created = await crearIngrediente({ nombre: newName, stock: newStock });
    if (created) {
      toast('Ingrediente agregado');
      setShowNewForm(false);
      setNewName('');
      setNewStock('');
      obtenerIngredientes();
    } else {
      toast('Error al crear ingrediente');
    }
  };

  const renderNewForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Nombre del ingrediente"
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
      />
      <TextInput
        placeholder="Stock inicial"
        value={newStock}
        onChangeText={setNewStock}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Guardar Ingrediente" onPress={handleCreateIngrediente} />
      <Button title="Cancelar" onPress={() => setShowNewForm(false)} color="red" />
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.stock}>Stock: {item.stock}</Text>
      </View>
      <View style={styles.filaControles}>
        <TextInput
          placeholder="+ cantidad"
          keyboardType="numeric"
          value={cantidades[item.id] || ''}
          onChangeText={text => setCantidades({ ...cantidades, [item.id]: text })}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.botonSolicitar}
          onPress={() => solicitarABodega(item.id)}
        >
          <Text style={styles.botonTexto}>Solicitar a bodega</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showNewForm ? (
        renderNewForm()
      ) : (
        <>
          <Button title="Agregar Ingrediente" onPress={() => setShowNewForm(true)} />
          <Text style={styles.titulo}>Inventario de Ingredientes</Text>
          <FlatList
            data={ingredientes}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text>No hay ingredientes registrados.</Text>}
          />
        </>
      )}
    </View>
  );
}
