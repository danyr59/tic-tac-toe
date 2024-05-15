//import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Platform, TouchableOpacity as RNGHTouchableOpacity, View, Text, Button, FlatList } from 'react-native';
import { TouchableOpacity as RNDomTouchableOpacity } from 'react-native-web';
import Board from './game';


/*<FlatList
      data={rooms}
      renderItem={({ item }) => <Room room={item} onJoin={onJoin} />}
      keyExtractor={(item) => item.id}
    />*/
const Room = ({ room, onJoin }) => (
  <View>
    <Text>{room.name}</Text>
    <Button title="Join" onPress={() => onJoin(room)} />
  </View>
);


const RoomPortal = ({ rooms, onJoin, onCreate }) => {
  const [view, setView] = useState(null);

  const handleJoinPress = () => {
    setView('join');
  };

  const handleCreatePress = () => {
    setView('create');
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Portal</Text>
      {view === 'join' && (
        <>
          <FlatList
            data={rooms}
            renderItem={({ item }) => <Room room={item} onJoin={onJoin} />}
            keyExtractor={(item) => item.id}
          />
          <Button title="Volver" onPress={() => setView(null)} />
        </>
      )}
      {view === 'create' && (
        <>
          <Text>Formulario para crear sala</Text>
          <Button title="Volver" onPress={() => setView(null)} />
        </>
      )}
      {!view && (
        <>
          <Button title="Unirse a Sala" onPress={handleJoinPress} />
          <Button title="Crear Sala" onPress={handleCreatePress} />
        </>
      )}
    </View>
  );
};



// Componente principal de la aplicación
const App = () => {
  const [rooms, setRooms] = useState([]); // Lista de salas
  const [currentRoom, setCurrentRoom] = useState(false); // Sala actual

  useEffect(() => {
    window.electronAPI.listen((event, data) => {
      console.log(data); // '¡Hola desde Electron!'
      // Haz algo con los datos recibidos
    });
  }, []);

  const onMainButton = () => {
    window.electronAPI.send('¡Hola Electron!');
  }

  const handleJoin = (room) => {
    //  agregar la lógica para unirse a una sala
    setCurrentRoom(room);
  };
  const handleCreate = (room) => {
    //  agregar la lógica para unirse a una sala
    // setCurrentRoom(room);
  };



  const handleExit = () => {
    // agregar la lógica para salir de la sala
    setCurrentRoom(null);
  };

  return currentRoom ? (
    <Board />
  ) : (
    <RoomPortal rooms={rooms} onJoin={handleJoin} onCreate={handleCreate} />
  );
}

export default App;
