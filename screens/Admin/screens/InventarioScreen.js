import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import supabase from '../../../supabase';
import styles from '../styles/InventarioStyle';

export default function InventarioScreen() {
  const [ingredientes, setIngredientes] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    obtenerIngredientes();
  }, []);

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
        style={styles.boton}
        onPress={() => aumentarStock(item.id, cantidades[item.id])}
      >
        <Text style={styles.botonTexto}>+</Text>
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
