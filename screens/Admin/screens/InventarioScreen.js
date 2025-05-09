import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Platform, ToastAndroid } from 'react-native';
import supabase from '../../../supabase';
import styles, { webToastStyle } from '../styles/InventarioStyle'; // asegúrate de tener esto en tu archivo de estilos

export default function InventarioScreen() {
  const [ingredientes, setIngredientes] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    obtenerIngredientes();
  }, []);

  const toast = (mensaje) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(mensaje, ToastAndroid.SHORT);
    } else {
      const toast = document.createElement('div');
      toast.textContent = mensaje;
  
      Object.entries(webToastStyle).forEach(([key, value]) => {
        toast.style[key] = value;
      });
  
      document.body.appendChild(toast);
      setTimeout(() => (toast.style.opacity = '1'), 10);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
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

  const solicitarABodega = async (id) => {
    const cantidad = parseInt(cantidades[id]);
  
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
      obtenerIngredientes(); // recarga lista
    }
  };


  const aumentarStock = async (id, cantidad) => {
    const incremento = parseInt(cantidad);
    if (isNaN(incremento) || incremento <= 0) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }

    const ingrediente = ingredientes.find(i => i.id === id);
    const nuevoStock = ingrediente.stock + incremento;

    const { error } = await supabase
      .from('ingredientes')
      .update({ stock: nuevoStock })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar el stock');
    } else {
      Alert.alert('Stock actualizado');
      setCantidades({ ...cantidades, [id]: '' });
      obtenerIngredientes();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.stock}>Stock: {item.stock}</Text>
      </View>

      <TextInput
        placeholder="+ cantidad"
        keyboardType="numeric"
        value={cantidades[item.id] || ''}
        onChangeText={(text) =>
          setCantidades({ ...cantidades, [item.id]: text })
        }
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.botonSolicitar}
        onPress={async () => {
          await solicitarABodega(item.id);
          toast('Solicitado a bodega');
          obtenerIngredientes(); // recarga datos sin recargar pantalla
        }}
      >
        <Text style={styles.botonTexto}>Solicitar a bodega</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inventario de Ingredientes</Text>
      <FlatList
        data={ingredientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay ingredientes registrados.</Text>}
      />
    </View>
  );
}
