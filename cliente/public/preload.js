const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  send: (title) => ipcRenderer.send('accion-en-electron', title),
  listen: (callback) =>  ipcRenderer.on('mensaje-desde-electron', callback)
})