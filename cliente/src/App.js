//import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
//import { Platform, TouchableOpacity as RNGHTouchableOpacity, View, Text, Button, FlatList, } from 'react-native';
//import { TouchableOpacity as RNDomTouchableOpacity } from 'react-native-web';
import Tablero from './game';



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
  ITS_NOT_TURN: 1,
  BOX_OCCUPED: 2,
  WIN: 3,
  ALL_BOX_OCCUPED: 4
};

const STATUS_RESTART = {
  WAITING_ANOTHER_USER: 0,
  WAITING_RESPONSE: 1

}


const Room = ({ room, onJoin, setWaiting }) => {
  const join = () => {
    onJoin(room); 
    
    const data = { action: ACTION.CHOOSE_ROOM, key_room: room };
    window.electronAPI.send(data);
  };
  return (
    <div className='salones'>
      <p>{room}</p>
      <button onClick={join}>Join</button>
    </div>
  );
}


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

const RoomPortal = ({ rooms, onJoin, onCreate, dataActions, setWaiting }) => {
  const [view, setView] = useState(null);
  const [r, setR] = useState([])
  const handleJoinPress = () => {
    const data = { action: ACTION.LIST_ROOM };
    window.electronAPI.send(data);
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
                <Room room={item} onJoin={onJoin} setWaiting={setWaiting} />
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
  const [rooms, setRooms] = useState([]); // Lista de salas
  const [currentRoom, setCurrentRoom] = useState(null); // Sala actual
  const [waiting, setWaiting] = useState(false);
  const [dataActions, setDataActions] = useState(null);
  const [id, setId] = useState(null);
  const [rol, setRol] = useState(null);
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  useEffect(() => {
    startServer()
    
  }, []);
  
  const TAM_BOARD = 3

  const parseTable = (table) =>
  {
    let newBoard = [[],[],[]];
      for(let i = 0;i < TAM_BOARD; ++i)
      {
          for(let j = 0; j < TAM_BOARD; ++j)
          {
            newBoard[i][j] = table[i][j] == -1 ? "" : (table[i][j] == 0 ? "O" : "X");
          }
      }
    console.log("Tablero: ", newBoard);
    setBoard(newBoard);
  }


  useEffect(() => {

    window.electronAPI.listen((event, data) => {
      setDataActions(data)
      if (data.action == ACTION.AUTHENTICATION) {
        setId(data.id);
      }

      if (data.action == ACTION.NEW_ROOM) {
        if (data.status == 1) {
          setWaiting(false);
        } else {
          //mostrar mensaje que no se pudo crear sala
        }

      }
      if (data.action == ACTION.LIST_ROOM) {
        if (data.list !== null) {
          console.log("RoomPortal")
          console.log(data.list);
          //console.log(data.list)
          setRooms(data.list);
        }

      }
      if (data.action == ACTION.START_GAME) {
        
        setRol(data.rol);
        setWaiting(false);
        parseTable(data.table);     
        

      }

      
      //data = JSON.parse(data);
      // '¡Hola desde Electron!'
      // Haz algo con los datos recibidos
      console.log(data.list);
    });


  }, []);

  const startServer = () => {
    const data = { action: ACTION.AUTHENTICATION };
    window.electronAPI.send(data);
  }

  const handleJoin = (room) => {
    //  agregar la lógica para unirse a una sala
    setCurrentRoom(room);
    setWaiting(true)
  };
  const handleCreate = (room) => {
    setCurrentRoom(room);
    setWaiting(true)
    const action = { action: ACTION.NEW_ROOM, key_room: room };
    window.electronAPI.send(action);
    


  };





  const handleExit = () => {
    // agregar la lógica para salir de la sala
    setCurrentRoom(null);
  };

  return currentRoom ? (
    !waiting ?
      (
        <Tablero board={board}room={currentRoom} exit={handleExit}  />
      ) : (
        <h3>Esperando Conexion</h3>
      )
  ) : (
    <RoomPortal rooms={rooms} onJoin={handleJoin} onCreate={handleCreate} dataActions={dataActions} setWaiting={setWaiting} />
  );
}

export default App;
