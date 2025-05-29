import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../../../supabase';
import { crearIngrediente } from '../controllers/InventarioController';
import AdminSidebar from '../../../components/AdminSidebar';
import styles, { webToastStyle } from '../styles/InventarioStyle';

const isMobile = Dimensions.get('window').width < 600;

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
      import('react-native').then(({ ToastAndroid }) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      });
    } else {
      const t = document.createElement('div');
      t.textContent = msg;
      Object.entries(webToastStyle).forEach(([k, v]) => t.style[k] = v);
      document.body.appendChild(t);
      setTimeout(() => t.style.opacity = '1', 10);
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
      console.error(error);
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
    const ing = ingredientes.find(i => i.id === id);
    const { error } = await supabase
      .from('ingredientes')
      .update({ stock: ing.stock + cantidad })
      .eq('id', id);
    if (error) {
      console.error(error);
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
        onChangeText={text => {
          const num = parseInt(text);
          if (!isNaN(num) && num >= 0) setNewStock(num.toString());
          else if (text === '') setNewStock('');
        }}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateIngrediente}>
        <Text style={styles.primaryBtnText}>Guardar Ingrediente</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dangerBtn} onPress={() => setShowNewForm(false)}>
        <Text style={styles.dangerBtnText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Pressable
      style={({ hovered }) => [styles.item, hovered && styles.itemHover]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <View style={styles.stockRow}>
          <Text style={styles.stockLabel}>Stock:</Text>
          <Text style={styles.stockValue}>{item.stock}</Text>
        </View>
      </View>
      <View style={styles.filaControles}>
        <TextInput
          placeholder="+ cantidad"
          keyboardType="numeric"
          value={cantidades[item.id] || ''}
          onChangeText={text => setCantidades({ ...cantidades, [item.id]: text })}
          style={styles.input}
        />
        <Pressable
          style={({ hovered }) => [styles.actionBtn, hovered && styles.actionBtnHover]}
          onPress={() => solicitarABodega(item.id)}
        >
          {({ hovered }) => (
            <Text style={[styles.actionBtnText, hovered && styles.actionBtnTextHover]}>Solicitar a bodega</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      {!isMobile && <AdminSidebar />}
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.headerTitleContainer}>

              <Text style={styles.headerTitle}>Inventario de Ingredientes</Text>
            </View>
            <Text style={styles.headerSubtitle}>Control de existencias en tiempo real</Text>
          </View>
          {!showNewForm && (
            <TouchableOpacity style={styles.newButton} onPress={() => setShowNewForm(true)}>
              <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.newButtonText}>Nuevo Ingrediente</Text>
            </TouchableOpacity>
          )}
        </View>

        {showNewForm ? (
          renderNewForm()
        ) : (
          <FlatList
            data={ingredientes}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            numColumns={isMobile ? 1 : 2}
            columnWrapperStyle={!isMobile && { justifyContent: 'space-between' }}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay ingredientes registrados.</Text>}
          />
        )}
      </ScrollView>
    </View>
  );
}

