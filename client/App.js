// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity as RNGHTouchableOpacity, View, Text, Button, FlatList } from 'react-native';
import { TouchableOpacity as RNDomTouchableOpacity } from 'react-native-web';
import Board from './game'; 

const TouchableOpacity = Platform.OS === 'web' ? RNDomTouchableOpacity : RNGHTouchableOpacity;

// Componente de la sala
const Room = ({ room, onJoin }) => (
  <View>
    <Text>{room.name}</Text>
    <Button title="Unirse" onPress={() => onJoin(room)} />
  </View>
);

// Componente del portal de salas
const RoomPortal = ({ rooms, onJoin }) => (
  <View>
    <Text>Portal de Salas</Text>
    <FlatList
      data={rooms}
      renderItem={({ item }) => <Room room={item} onJoin={onJoin} />}
      keyExtractor={(item) => item.id}
    />
  </View>
);

// Componente del juego
const Game = ({ onMove, onRestart, onExit, board }) => {
  // agregar la lógica del juego y la interfaz de usuario
    const [gameBoard, setGameBoard] = useState(board);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const handleCellPress = (i, j) => {
    // Verifica si la celda está vacía antes de hacer un movimiento
    if (gameBoard[i][j] === '') {
      // Crea una copia del tablero del juego
      const newGameBoard = [...gameBoard];
      // Actualiza la celda presionada con el jugador actual
      newGameBoard[i][j] = currentPlayer;
      // Actualiza el tablero del juego en el estado
      setGameBoard(newGameBoard);
      // Cambia el jugador actual
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      // Llama a la función onMove para informar al servidor sobre el movimiento
      onMove(i, j);
    }
  };

  const handleRestartPress = () => {
    // Reinicia el tablero del juego
    setGameBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    // Reinicia el jugador actual
    setCurrentPlayer('X');
    // Llama a la función onRestart para informar al servidor sobre el reinicio
    onRestart();
  };

  const handleExitPress = () => {
    // Llama a la función onExit para informar al servidor sobre la salida
    onExit();
  };

  return (
    <View>
      <Text>Jugador actual: {currentPlayer}</Text>
      <Board board={gameBoard} onCellPress={handleCellPress} />
      <Button title="Reiniciar" onPress={handleRestartPress} />
      <Button title="Salir" onPress={handleExitPress} />
    </View>
  );
};

// Componente principal de la aplicación
const App = () => {
  const [rooms, setRooms] = useState([]); // Lista de salas
  const [currentRoom, setCurrentRoom] = useState(null); // Sala actual

  useEffect(() => {
    // agregar la lógica para obtener la lista de salas del servidor
    // hacer una solicitud al servidor para obtener la lista de salas
    // y luego usar setRooms para actualizar el estado de las salas
  }, []);

  const handleJoin = (room) => {
    //  agregar la lógica para unirse a una sala
    setCurrentRoom(room);
  };

  const handleMove = (move) => {
    // agregar la lógica para hacer un movimiento en el juego
  };

  const handleRestart = () => {
    // agregar la lógica para reiniciar el juego
  };

  const handleExit = () => {
    // agregar la lógica para salir de la sala
    setCurrentRoom(null);
  };

  return currentRoom ? (
    <Game onMove={handleMove} onRestart={handleRestart} onExit={handleExit} />
  ) : (
    <RoomPortal rooms={rooms} onJoin={handleJoin} />
  );
};

export default App;

