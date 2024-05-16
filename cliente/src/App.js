//import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
//import { Platform, TouchableOpacity as RNGHTouchableOpacity, View, Text, Button, FlatList, } from 'react-native';
//import { TouchableOpacity as RNDomTouchableOpacity } from 'react-native-web';
import Board from './game';



const ACTION = {
  AUTHENTICATION: 0,
  NEW_ROOM: 1,
  CHOOSE_ROOM: 2,
  SELECT_MOVEMENT: 3,
  OUT_ROOM: 4,
  OUT_GAME: 5,
  LIST_ROOM: 6,
  START_GAME: 7,
  MOVE: 10,
  CLOSE: 11,
  RESTART: 12,
  UPDATE: 13,
  WIN: 14
};

const STATUS = {
  OK: 0,
  ITS_NOT_TURN : 1,
  BOX_OCCUPED :2,
  WIN: 3,
  ALL_BOX_OCCUPED: 4
};

const STATUS_RESTART = {
  WAITING_ANOTHER_USER : 0,
  WAITING_RESPONSE: 1

}

/*<FlatList
      data={rooms}
      renderItem={({ item }) => <Room room={item} onJoin={onJoin} />}
      keyExtractor={(item) => item.id}
    />*/
const Room = ({ room, onJoin }) => (
  <div className='salones'>
    <p>{room}</p>
    <button onClick={() => onJoin(room)}>Join</button>
  </div>
);
const CreateRoom = ({ onCreate, setView }) => {
  const [nameRoom, setNameRoom] = useState(null);
  const handleNameChange = (e) => {
    setNameRoom(e.target.value);
  };

  const crearRoom = () => {
    
    console.log("crearRoom")
    onCreate(nameRoom)
  };
  return (
    <>
      <p>Formulario para crear sala</p>
      <input type="text" value={nameRoom} onChange={handleNameChange} />
      <div>
        <button onClick={crearRoom}>Crear Sala</button>
        <button onClick={() => setView(null)}>Volver</button>
      </div>
    </>
  );
};

const RoomPortal = ({ rooms, onJoin, onCreate }) => {
  const [view, setView] = useState(null);

  const handleJoinPress = () => {
    setView('join');
  };

  const handleCreatePress = () => {
    setView('create');
  };

  return (
    <div style={{ alignItems: 'center' }}>
      <p style={{ fontSize: 24, marginBottom: 10 }}>Portal</p>
      {view === 'join' && (
        <>
          <ul>
            {rooms.map((item) => (
              <li key={item.id}>
                <Room room={item} onJoin={onJoin} />
              </li>
            ))}
          </ul>
          <button onClick={() => setView(null)}>Volver</button>
        </>
      )}
      {view === 'create' && (
        <>
          <CreateRoom onCreate={onCreate} setView={setView} />
        </>
      )}
      {!view && (
        <>
          <button onClick={handleJoinPress}>Unirse a Sala</button>
          <button onClick={handleCreatePress}>Crear Sala</button>
        </>
      )}
    </div>
  );
};

// Componente principal de la aplicación
const App = () => {
  const [rooms, setRooms] = useState(["sala1", "sala2"]); // Lista de salas
  const [currentRoom, setCurrentRoom] = useState(null); // Sala actual
  const [waiting, setWaiting] = useState(false);
  const [dataActions, setDataActions] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    startServer()
    console.log("cuantas veces");
  }, []);



  useEffect(() => {

    window.electronAPI.listen((event, data) => {
      setDataActions(data)
      if(data.ACTION == ACTION.AUTHENTICATION){
        setId(data.id);
      }
      //data = JSON.parse(data);
      console.log(data); // '¡Hola desde Electron!'
      // Haz algo con los datos recibidos
    });


  }, []);

  const startServer = () => {
    const data = {action: ACTION.AUTHENTICATION};
    window.electronAPI.send(data);
  }

  const handleJoin = (room) => {
    //  agregar la lógica para unirse a una sala
    setCurrentRoom(room);
  };
  const handleCreate = (room) => {
    setCurrentRoom(room);
    setWaiting(true)
    const action = {action: ACTION.NEW_ROOM, key_room: room};
    window.electronAPI.send(action);
    //voy a simular cuando la contraparte cree la sala
    setTimeout(() => {
      
      setWaiting(false)
    }, 5000);


  };





  const handleExit = () => {
    // agregar la lógica para salir de la sala
    setCurrentRoom(null);
  };

  return currentRoom ? (
    !waiting ?
      (
        <Board room={currentRoom} exit={handleExit} />
      ) : (
        <h3>Esperando Conexion</h3>
      )
  ) : (
    <RoomPortal rooms={rooms} onJoin={handleJoin} onCreate={handleCreate} />
  );
}

export default App;
