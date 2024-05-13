import { AppRegistry } from 'react-native';
import App from './App';  // Importa componente principal App
import reportWebVitals from './reportWebVitals';
//import App from './game';
import appConfig from './app.json';  // Importa app.json

AppRegistry.registerComponent(appConfig.name, () => App);  // Usa appConfig.name para registrar el componente

AppRegistry.runApplication(appConfig.name, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});

// Si deseas medir el rendimiento de tu aplicación, puedes usar reportWebVitals
reportWebVitals();

