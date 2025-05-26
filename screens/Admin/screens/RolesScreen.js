import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AdminSidebar from '../../../components/AdminSidebar';
import {
  crearMesero,
  obtenerMeseros,
  actualizarEstadoMesero,
} from '../controllers/RolesController';
import styles from '../styles/RolesStyle';
import { Ionicons } from '@expo/vector-icons';

const RolesScreen = ({ navigation, onLogout }) => {
  // Formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Turno actual (display)
  const [horaInicioTurno] = useState(new Date());
  const [horaFinTurno] = useState(new Date());

  // Estados y pickers del formulario
  const [horaInicioForm, setHoraInicioForm] = useState(horaInicioTurno);
  const [horaFinForm, setHoraFinForm] = useState(horaFinTurno);
  const [showFormInicio, setShowFormInicio] = useState(false);
  const [showFormFin, setShowFormFin] = useState(false);

  // Texto editable para web en HH:MM
  const [horaInicioText, setHoraInicioText] = useState(
    horaInicioForm.toTimeString().slice(0, 5)
  );
  const [horaFinText, setHoraFinText] = useState(
    horaFinForm.toTimeString().slice(0, 5)
  );

  // Lista de meseros
  const [meseros, setMeseros] = useState([]);

  const partialTimeRegex = /^([01]?\d|2[0-3])?(:([0-5]?\d)?)?$/;
  const fullTimeRegex    = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // Carga inicial
  useEffect(() => {
    (async () => {
      const lista = await obtenerMeseros();
      setMeseros(lista);
    })();
  }, []);

  // Crear mesero
  const handleCrear = async () => {
    if (!fullTimeRegex.test(horaInicioText) || !fullTimeRegex.test(horaFinText)) {
      alert('Por favor ingresa horas en formato HH:MM válido');
      return;
    }
    await crearMesero({
      nombre,
      apellido,
      correo,
      contrasena,
      hora_inicio: horaInicioText,
      hora_fin:    horaFinText,
    });
    // Reset formulario
    setNombre('');
    setApellido('');
    setCorreo('');
    setContrasena('');
    setHoraInicioForm(horaInicioTurno);
    setHoraFinForm(horaFinTurno);
    setHoraInicioText(horaInicioTurno.toTimeString().slice(0, 5));
    setHoraFinText(horaFinTurno.toTimeString().slice(0, 5));
    // Refresca lista completa tras creación
    const lista = await obtenerMeseros();
    setMeseros(lista);
  };

  // Alternar activo/inactivo: elimina inmediatamente de la lista local
  const toggleEstado = async (id, estado) => {
    await actualizarEstadoMesero(id, !estado);
    setMeseros(prev => prev.filter(m => m.id !== id));
  };

  // Cálculo de métricas
  const activeCount = meseros.filter(m => m.estado).length;
  const validTimes = meseros.filter(
    m =>
      typeof m.hora_inicio === 'string' &&
      m.hora_inicio.includes(':') &&
      typeof m.hora_fin === 'string' &&
      m.hora_fin.includes(':')
  );
  const avgHours = validTimes.length
    ? (
        validTimes.reduce((sum, m) => {
          const [hiH, hiM] = m.hora_inicio.split(':').map(Number);
          const [hfH, hfM] = m.hora_fin.split(':').map(Number);
          const start = hiH + hiM / 60;
          const end = hfH + hfM / 60;
          return sum + (end >= start ? end - start : end + 24 - start);
        }, 0) / validTimes.length
      ).toFixed(1)
    : '0.0';

  // Handler web para input de hora
  const onChangeWebTime = (text, setDate, setText) => {
    const cleaned = text.replace(/[^0-9:]/g, '');
    if (cleaned.length > 5) return;
    if (partialTimeRegex.test(cleaned)) {
      setText(cleaned);
      const parts = cleaned.split(':');
      if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 2) {
        const [h, m] = parts.map(Number);
        if (h < 24 && m < 60) {
          const d = new Date();
          d.setHours(h);
          d.setMinutes(m);
          setDate(d);
        }
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <AdminSidebar navigation={navigation} activeRoute="Roles" onLogout={onLogout} />
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.container}>
        {/* Header principal */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Gestión de Meseros</Text>
            <Text style={styles.pageSubtitle}>
              Meseros activos: {activeCount} | Turno actual:{' '}
              {horaInicioTurno.toTimeString().slice(0, 5)} -{' '}
              {horaFinTurno.toTimeString().slice(0, 5)}
            </Text>
          </View>
        </View>

        {/* Top: Form + Stats */}
        <View style={styles.topSection}>
          {/* Registro */}
          <View style={[styles.cardBase, styles.cardWide]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBg}>
                <Ionicons name="person-outline" size={20} color="#FF6B35" />
              </View>
              <Text style={styles.cardTitle}>Registro de Mesero</Text>
            </View>
            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>
              <View style={styles.formItem}>
                <TextInput
                  style={styles.input}
                  placeholder="Apellido"
                  value={apellido}
                  onChangeText={setApellido}
                />
              </View>
              <View style={styles.formItem}>
                <TextInput
                  style={styles.input}
                  placeholder="Correo"
                  keyboardType="email-address"
                  value={correo}
                  onChangeText={setCorreo}
                />
              </View>
              <View style={styles.formItem}>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  secureTextEntry
                  value={contrasena}
                  onChangeText={setContrasena}
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.inputLabel}>Hora inicio</Text>
                {Platform.OS === 'web' ? (
                  <TextInput
                    style={styles.input}
                    value={horaInicioText}
                    onChangeText={t =>
                      onChangeWebTime(t, setHoraInicioForm, setHoraInicioText)
                    }
                    placeholder="hh:mm"
                    keyboardType="numeric"
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowFormInicio(true)}
                    >
                      <Text style={styles.input}>{horaInicioText}</Text>
                    </TouchableOpacity>
                    {showFormInicio && (
                      <DateTimePicker
                        value={horaInicioForm}
                        mode="time"
                        is24Hour
                        display="default"
                        onChange={(e, d) => {
                          setShowFormInicio(false);
                          if (d) {
                            const txt = d.toTimeString().slice(0, 5);
                            setHoraInicioForm(d);
                            setHoraInicioText(txt);
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>
              <View style={styles.formItem}>
                <Text style={styles.inputLabel}>Hora fin</Text>
                {Platform.OS === 'web' ? (
                  <TextInput
                    style={styles.input}
                    value={horaFinText}
                    onChangeText={t =>
                      onChangeWebTime(t, setHoraFinForm, setHoraFinText)
                    }
                    placeholder="hh:mm"
                    keyboardType="numeric"
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowFormFin(true)}
                    >
                      <Text style={styles.input}>{horaFinText}</Text>
                    </TouchableOpacity>
                    {showFormFin && (
                      <DateTimePicker
                        value={horaFinForm}
                        mode="time"
                        is24Hour
                        display="default"
                        onChange={(e, d) => {
                          setShowFormFin(false);
                          if (d) {
                            const txt = d.toTimeString().slice(0, 5);
                            setHoraFinForm(d);
                            setHoraFinText(txt);
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.newButton} onPress={handleCrear}>
              <Ionicons name="add-outline" size={20} color="#FFF" />
              <Text style={styles.newButtonText}>Nuevo Mesero</Text>
            </TouchableOpacity>
          </View>

          {/* Estadísticas */}
          <View style={[styles.cardBase, styles.cardNarrow]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBgLight}>
                <Ionicons name="trending-up-outline" size={20} color="#FF6B35" />
              </View>
              <Text style={styles.cardTitle}>Rendimiento del Turno</Text>
            </View>
            <View style={styles.statsList}>
              <View style={[styles.statItem, styles.statItemAccent]}>
                <Text style={styles.statLabel}>Meseros Activos</Text>
                <Text style={styles.statValueAccent}>{activeCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Horas Promedio</Text>
                <Text style={styles.statValue}>{avgHours}h</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Comisión Promedio</Text>
                <Text style={styles.statValue}>0.0%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lista de Meseros */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Lista de Meseros Activos</Text>
          <FlatList
            data={meseros.filter(m => m.estado)}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.avatarBg}>
                    <Ionicons name="person-outline" size={18} color="#FF6B35" />
                  </View>
                  <View>
                    <Text style={styles.listName}>{item.nombre}</Text>
                    <Text style={styles.listEmail}>{item.gmail}</Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={styles.listTime}>
                    {item.hora_inicio} - {item.hora_fin}
                  </Text>
                  <Switch
                    value={item.estado}
                    onValueChange={() => toggleEstado(item.id, item.estado)}
                  />
                </View>
              </View>
            )}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default RolesScreen;
