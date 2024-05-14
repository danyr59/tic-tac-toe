import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';


function App() {
  
  useEffect(() => {
    window.electronAPI.listen((event, data) => {
    console.log(data); // '¡Hola desde Electron!'
    // Haz algo con los datos recibidos
    });
  }, []);

  const onMainButton = () =>
  {
    window.electronAPI.send('¡Hola Electron!');
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={onMainButton}>Clicar</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
