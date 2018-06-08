import { setIpc, openDirectory, saveFile, openPreferences } from './main-window/ipcRendererEvents'
import { addImageEvents, searchImagesEvent, selectEvent, print } from './main-window/images-ui'

// import os from 'os'
window.addEventListener('load', () => {
  // document.getElementById('mensaje').innerHTML = 'Este es un mensaje insertado por JS'
  // console.log(os.cpus())
  setIpc()
  addImageEvents()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
  buttonEvent('open-preferences', openPreferences)
  buttonEvent('save-button', saveFile)
  buttonEvent('print-button', print)
})

function buttonEvent (id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}
