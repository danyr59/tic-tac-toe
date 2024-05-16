import React, { useState } from 'react';

const Cell = ({ value, onPress }) => (
  <div
    style={{
      width: 50,
      height: 50,
      border: '1px solid black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onClick={onPress}
  >
    <p style={{ fontSize: 24 }}>{value}</p>
  </div>
);

const Board = ({ board, onCellPress }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {board.map((row, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
        {row.map((cell, j) => (
          <Cell key={j} value={cell} onPress={() => onCellPress(i, j)} />
        ))}
      </div>
    ))}
  </div>
);

const Game = ({ currentPlayer, winner, onMove, onRestart, onExit, board, nameRoom }) => {
  const handleCellPress = (i, j) => {
    // Lógica para manejar el movimiento del jugador
    const newBoard = [...board];
    if (!newBoard[i][j]) {
      newBoard[i][j] = currentPlayer === 'Jugador 1' ? 'X' : 'O';
      onMove(newBoard);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p>Name Room: {nameRoom}</p>
      <p style={{ fontSize: 24, marginBottom: 10 }}>Turno de {currentPlayer}</p>
      <Board board={board} onCellPress={handleCellPress} />
      {winner && <p style={{ fontSize: 24, marginVertical: 20 }}>{winner} ha ganado!</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginTop: 20 }}>
        <button onClick={onRestart}>Reiniciar</button>
        <button onClick={onExit}>Salir</button>
      </div>
    </div>
  );
};

const Tablero = ({room, exit,dataActions}) => {
  console.log(room)
  const [currentPlayer, setCurrentPlayer] = useState('Jugador 1');
  const [winner, setWinner] = useState(null);
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const handleMove = (newBoard) => {
    // Lógica para verificar si hay un ganador y actualizar el estado de 'winner'
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'Jugador 1' ? 'Jugador 2' : 'Jugador 1');
  };

  const handleRestart = () => {
    setCurrentPlayer('Jugador 1');
    setWinner(null);
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  };

  const handleExit = () => {
    setCurrentPlayer('Jugador 1');
    setWinner(null);
    setBoard([]);
    exit();
  };

  return (
    <Game
      nameRoom={room}
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
