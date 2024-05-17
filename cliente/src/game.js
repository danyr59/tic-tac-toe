import React, { useState } from 'react';

import { ACTION,STATUS, STATUS_RESTART } from './utils';

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

const Game = ({ turn, currentPlayer, winner, board, nameRoom }) => {
  const handleCellPress = (i, j) => {
    if (turn) {
      const data = { action: ACTION.MOVE, move : (i * 3 + j) };
      window.electronAPI.send(data); 
    } else {
      console.log("No es tu turno");
    }
  };

  const onRestart = () =>
  {
    const data = { action: ACTION.RESTART};
    window.electronAPI.send(data); 
  }
  const onExit = () =>
  {
    const data = { action: ACTION.CLOSE};
    window.electronAPI.send(data); 
  }

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

const Tablero = ({ board, room, turn, exit }) => {
  console.log(room)
  const [currentPlayer, setCurrentPlayer] = useState('Jugador 1');
  const [winner, setWinner] = useState(null);

  return (
    <Game
      nameRoom={room}
      currentPlayer={currentPlayer}
      winner={winner}
      board={board}
      turn={turn}
    />
  );
};

export default Tablero;
