const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const net = require('net');


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
  BOX_OCCUPIED: 2,
  WIN: 3,
  ALL_BOX_OCCUPIED: 4
};

const STATUS_RESTART = {
  WAITING_ANOTHER_USER: 0,
  WAITING_RESPONSE: 1
};


let rol = 0;





function sendData(data) {
  client.write(JSON.stringify(data));
}


function handleData(data) {
  console.log("handleData")
  const n_data = data;
  console.log('Datos recibidos:', n_data);

  switch (n_data.action) {
    case ACTION.AUTHENTICATION:
      handleAuthentication();
      break;
    case ACTION.NEW_ROOM:
      handleNewRoom(n_data);
      break;
    case ACTION.LIST_ROOM:
      handleListRoom(n_data);
      break;
    case ACTION.CHOOSE_ROOM: 
      sendData(n_data);
      break;
    case ACTION.UPDATE:
      
      break;
    default:
      console.log("Acción no reconocida.");
  }
}


function handleAuthentication() {
  console.log("autenticado");
 
}

function handleNewRoom(data) {
  
  sendData(data);
  
}

function handleListRoom(data) {
 
  sendData(data);
  
}


let mainWindow;



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }

  });


  mainWindow.loadURL('http://localhost:3000');

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

const client = net.createConnection({
  host: 'localhost',
  port: 5000
});




client.on('connect', () => {


  ipcMain.on('accion-en-electron', (event, arg) => {
    console.log("event:", event);
    console.log("arg:", arg); // arg es el mensaje enviado desde React
    
    console.log("antes de handle")
    handleData(arg)

    //aqui manejo la data del servidor y la mando al electron app
    client.on('data', (data) => {
      const dataString = data.toString();
      console.log(dataString);
      //console.log(JSON.parse(data))
      //data = JSON.parse(data);
      try {
        mainWindow.webContents.send('mensaje-desde-electron', JSON.parse(data));
      } catch (error) {
        console.log(error);
      }
    });
  });

});



client.on('error', (error) => {
  console.error("Error de conexión:", error);
});

//recibe un mensaje desde electron

/*

//envia un mensaje a renderer process
ipcMain.on('mensaje-desde-electron', (event, data) => {
  console.log(data)
  //sendData(data);
});

*/