import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
//import { Platform, TouchableOpacity as RNGHTouchableOpacity, View, Text, Button, FlatList, } from 'react-native';
//import { TouchableOpacity as RNDomTouchableOpacity } from 'react-native-web';
import Tablero from './game';

import { ACTION,STATUS, STATUS_RESTART } from './utils';
import ErrorMsg from './ErrorMsg';
import WaitingPage from './WaitingPage';


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
      <div>
        <h2>Crear sala</h2>
        <input type="text" placeholder='Nombre' value={nameRoom} onChange={handleNameChange} />
      </div>
      <div>
        <button className='btn' onClick={crearRoom}>Crear Sala</button>
        <button className='btn' onClick={() => setView(null)}>Volver</button>
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
    <div className='menu'>

      {view === 'join' && (
        <>
          <ul>
            {rooms.map((item) => (
              <li key={item.id}>
                <Room room={item} onJoin={onJoin} setWaiting={setWaiting} />
              </li>
            ))}
          </ul>
          <button className='btn' onClick={() => setView(null)}>Volver</button>
        </>
      )}
      {view === 'create' && (
        <>
          <CreateRoom onCreate={onCreate} setView={setView} />
        </>
      )}
      {!view && (
        <>
          <div>
            <h2>Menu</h2>
            <button className='btn' onClick={handleJoinPress}>Unirse a Sala</button>
            <button className='btn' onClick={handleCreatePress}>Crear Sala</button>
          </div>
          <button className='btn'>Cerrar</button>
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
  const [rol, setRol] = useState(null);
  const [id, setId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [turn, setTurn] = useState(null);
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
          setWaiting(true);
        } else {
          setErrorMsg("No se pudo crear sala");
          //mostrar mensaje que 
        }

      }
      if (data.action == ACTION.LIST_ROOM) {
        if (data.list !== null) {
          console.log("RoomPortal")
          console.log(data.list);
          //console.log(data.list)
          setRooms(data.list);
        }else
        {
          setRooms([]);
        }

      }
      if (data.action == ACTION.START_GAME) {
        console.log(data);
        setRol(data.rol);
        setTurn(data.rol == data.turn);
        setWaiting(false);
        parseTable(data.table);     

      }
      if (data.action == ACTION.UPDATE) {
        
        console.log("rol :",rol, "turn:", rol == data.turn);
        setTurn(rol == data.turn);
        parseTable(data.table);     
        console.log("status :", data.status);

      }
      if (data.action == ACTION.WIN) {
        if(rol == data.turn)
        {
          console.log("GANASTEE");
        }
        //setTurn(rol == data.turn);
        parseTable(data.table);     

      }
      if (data.action == ACTION.RESTART) {
        if(data.status == 0)
        {
          console.log("Esparando respuesta de otro jugador");
        }else
        {
          console.log("El otro jugador marco");
        }

      }
      if (data.action == ACTION.OUT_ROOM) {
        setCurrentRoom(null);
  
      }

  
    });


  }, [rol]);

  const startServer = () => {
    const data = { action: ACTION.AUTHENTICATION };
    window.electronAPI.send(data);
  }

  const handleJoin = (room) => {
    //  agregar la lógica para unirse a una sala
    setCurrentRoom(room);
    //setWaiting(true)
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

  let display;
  
  if(currentRoom && !waiting)
  display = <Tablero board={board}room={currentRoom} exit={handleExit}  turn={turn}  />
  else if(currentRoom)
  {
    display = <WaitingPage />;
  }else
  {
    
    display = <RoomPortal rooms={rooms} onJoin={handleJoin} onCreate={handleCreate} dataActions={dataActions} setWaiting={setWaiting} />;
  }


  return (
    <div className='app'>
      <header>
          <img src={logo} alt="" className="App-logo" />
        <h1>La vieja</h1>
      </header>
      <main>
        {display}
      </main>
      <ErrorMsg msg={errorMsg}/>
    </div>
  );
}

export default App;
