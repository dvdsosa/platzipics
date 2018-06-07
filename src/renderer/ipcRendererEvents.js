import { ipcRenderer } from 'electron'

// este funciona en el lado del proceso de renderizado

function setIpc () {
  ipcRenderer.on('pong', (event, arg) => {
    console.log(`pong recibido - ${arg}`)
  })
}

function openDirectory () {
  ipcRenderer.send('open-directory')
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory
}
