import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,FlatList,Switch,Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  crearMesero,
  obtenerMeseros,
  actualizarEstadoMesero,
} from '../controllers/RolesController';
import styles from '../styles/RolesStyle';

const RolesScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showFin, setShowFin] = useState(false);
  const [meseros, setMeseros] = useState([]);

  const cargarMeseros = async () => {
    const lista = await obtenerMeseros();
    setMeseros(lista);
  };

  const handleCrear = async () => {
    await crearMesero({
        nombre,
        apellido, // <-- ¡Este campo FALTABA AQUÍ!
        correo,
        contrasena,
        hora_inicio: horaInicio.toTimeString().slice(0, 5),
        hora_fin: horaFin.toTimeString().slice(0, 5),
    });
      

    setNombre('');
    setCorreo('');
    setContrasena('');
    setHoraInicio(new Date());
    setHoraFin(new Date());
    cargarMeseros();
  };

  const toggleEstado = async (id, estadoActual) => {
    await actualizarEstadoMesero(id, !estadoActual);
    cargarMeseros();
  };

  const renderTimeInput = (label, value, onChange, show, setShow) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.timeText}>{label}</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={styles.input}
            value={value.toTimeString().slice(0, 5)}
            onChangeText={(text) => {
              const [h, m] = text.split(':');
              const nuevaFecha = new Date();
              nuevaFecha.setHours(parseInt(h));
              nuevaFecha.setMinutes(parseInt(m));
              onChange(nuevaFecha);
            }}
            keyboardType="numeric"
            placeholder="hh:mm"
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShow(true)}
            >
              <Text style={styles.timeText}>{value.toTimeString().slice(0, 5)}</Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                value={value}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShow(false);
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            )}
          </>
        )}
      </View>
    );
  };

  useEffect(() => {
    cargarMeseros();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crear Mesero</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        secureTextEntry
        onChangeText={setContrasena}
      />

      {renderTimeInput('Hora inicio', horaInicio, setHoraInicio, showInicio, setShowInicio)}
      {renderTimeInput('Hora fin', horaFin, setHoraFin, showFin, setShowFin)}

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Guardar Mesero</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Lista de Meseros</Text>
      <FlatList
        data={meseros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.meseroItem}>
            <Text>
              {item.nombre} | {item.hora_inicio} - {item.hora_fin}
            </Text>
            <Switch
              value={item.estado}
              onValueChange={() => toggleEstado(item.id, item.estado)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default RolesScreen;
