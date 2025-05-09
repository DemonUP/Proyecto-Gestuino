import React from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Switch,
} from 'react-native';
import { useMenuController } from '../controllers/MenuController';
import styles from '../styles/MenuStyles';

export default function MenuScreen() {
  const {
    productos,
    faltantes,
    toggleActivo,
    actualizarPrecio
  } = useMenuController();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombreProducto}>{item.nombre}</Text>

      <View style={styles.filaPrecio}>
        <Text style={styles.label}>Precio:</Text>
        <TextInput
          style={styles.inputPrecio}
          keyboardType="numeric"
          defaultValue={item.precio.toString()}
          onEndEditing={(e) => actualizarPrecio(item.id, e.nativeEvent.text)}
        />
      </View>

      {faltantes[item.id]?.length > 0 && (
        <View style={styles.faltantesContainer}>
          <Text style={styles.etiquetaFaltan}>Faltan ingredientes:</Text>
          {faltantes[item.id].map((ing, i) => (
            <Text key={i} style={styles.ingredienteFaltante}>• {ing}</Text>
          ))}
        </View>
      )}

      <View style={styles.filaActivo}>
        <Text style={styles.labelActivo}>Activo:</Text>
        <Switch
          value={item.activo}
          onValueChange={(val) => toggleActivo(item.id, val)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Menú del Restaurante</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay productos registrados.</Text>}
      />
    </View>
  );
}
