import { ipcRenderer } from 'electron'

// este funciona en el lado del proceso de renderizado

function setIpc(){
  ipcRenderer.on('pong', (event, arg)=>{
    console.log(`pong recibido - ${arg}`)
  })
}

function sendIpc () {
  ipcRenderer.send('ping', new Date())
}

module.exports = {
  setIpc: setIpc,
  sendIpc: sendIpc
}