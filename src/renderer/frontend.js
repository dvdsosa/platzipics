import { setIpc, openDirectory, saveFile } from './ipcRendererEvents'
import { addImageEvents, searchImagesEvent, selectEvent } from './images-ui'

// import os from 'os'
window.addEventListener('load', () => {
  // document.getElementById('mensaje').innerHTML = 'Este es un mensaje insertado por JS'
  // console.log(os.cpus())
  setIpc()
  addImageEvents()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
  buttonEvent('save-button', saveFile)
})

function buttonEvent (id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}
