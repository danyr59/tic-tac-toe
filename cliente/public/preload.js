const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  //envia un mensaje al process main
  send: (title) => ipcRenderer.send('accion-en-electron', title),
  //recibe un mensaje desde process main 
  listen: (callback) =>  ipcRenderer.on('mensaje-desde-electron', callback),
  listenTextPlain: (callback) =>  ipcRenderer.on('mensaje-plano-desde-electron', callback)
 
})