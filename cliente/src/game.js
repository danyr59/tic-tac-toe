import React, { useState } from 'react';
import { Platform, TouchableOpacity as RNGHTouchableOpacity, View, Text, Button, FlatList } from 'react-native';
import { TouchableOpacity as RNDomTouchableOpacity } from 'react-native-web';

const TouchableOpacity = Platform.OS === 'web' ? RNDomTouchableOpacity : RNGHTouchableOpacity;

// Componente de la celda del tablero mejorado
const Cell = ({ value, onPress }) => (
  <TouchableOpacity style={{ width: 50, height: 50, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }} onPress={onPress}>
    <Text style={{ fontSize: 24 }}>{value}</Text>
  </TouchableOpacity>
);


// Componente del tablero del juego mejorado
const Board = ({ board, onCellPress }) => (
  <View style={{ alignItems: 'center' }}>
    {board.map((row, i) => (
      <View key={i} style={{ flexDirection: 'row' }}>
        {row.map((cell, j) => (
          <Cell key={j} value={cell} onPress={() => onCellPress(i, j)} />
        ))}
      </View>
    ))}
  </View>
);


// Componente del juego mejorado
const Game = ({ currentPlayer, winner, onMove, onRestart, onExit, board }) => {
  const handleCellPress = (i, j) => {
    // la logica para manejar el movimiento del jugador
    onMove(i, j);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Turno de {currentPlayer}</Text>
      <Board board={board} onCellPress={handleCellPress} />
      {winner && <Text style={{ fontSize: 24, marginVertical: 20 }}>{winner} ha ganado!</Text>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20 }}>
        <Button title="Reiniciar" onPress={onRestart} />
        <Button title="Salir" onPress={onExit} />
      </View>
    </View>
  );
};

// Componente principal de la aplicacion mejorado
const Tablero = () => {
  const [currentPlayer, setCurrentPlayer] = useState('Jugador 1');
  const [winner, setWinner] = useState(null);
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const handleMove = (i, j) => {
    //  la logica para manejar los movimientos y verificar el ganador
    const newBoard = [...board];
    if (!newBoard[i][j]) {
      newBoard[i][j] = currentPlayer === 'Jugador 1' ? 'X' : 'O';
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'Jugador 1' ? 'Jugador 2' : 'Jugador 1');
      // Aquí verifica si hay un ganador y actualiza el estado de 'winner'
    }
  };

  const handleRestart = () => {
    // Aquí puedes agregar la lógica para reiniciar el juego
    setCurrentPlayer('Jugador 1');
    setWinner(null);
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  };

  const handleExit = () => {
    // Aquí puedes agregar la lógica para salir del juego
    setCurrentPlayer('Jugador 1');
    setWinner(null);
    setBoard([]);
  };

  return (
    <Game
      currentPlayer={currentPlayer}
      winner={winner}
      onMove={handleMove}
      onRestart={handleRestart}
      onExit={handleExit}
      board={board}
    />
  );
};

export default Tablero;
