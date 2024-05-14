const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const net = require('net');
//const isDev = require('electron-is-dev');

let mainWindow;


function createWindow() {
  mainWindow = new BrowserWindow({width: 900,
        height: 680,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
    });

    ipcMain.on('accion-en-electron', (event, arg) => {
        console.log("event:" , event);
        console.log("arg:" ,arg); // arg es el mensaje enviado desde React
        // Realizar la acción en Electron
        const client = net.createConnection({
          host: 'localhost',
          port: 5000
        });
        client.on('connect', () => {
          mainWindow.webContents.send('mensaje-desde-electron', 'Conectado al servidor');
          client.on('data', (data) => { 
            data = JSON.parse(data);
            mainWindow.webContents.send('mensaje-desde-electron', data);
          });

        });

    });

  mainWindow.loadURL('http://localhost:3000');
  //mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  //if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    //mainWindow.webContents.openDevTools();
  //}
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});