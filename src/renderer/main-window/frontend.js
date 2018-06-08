import { setIpc, openDirectory, saveFile, openPreferences, uploadImage, pasteImage } from './main-window/ipcRendererEvents'
import { addImageEvents, searchImagesEvent, selectEvent, print } from './main-window/images-ui'
import createMenu from './main-window/menu'

// import os from 'os'
window.addEventListener('load', () => {
  // document.getElementById('mensaje').innerHTML = 'Este es un mensaje insertado por JS'
  // console.log(os.cpus())
  createMenu()
  setIpc()
  addImageEvents()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
  buttonEvent('open-preferences', openPreferences)
  buttonEvent('save-button', saveFile)
  buttonEvent('print-button', print)
  buttonEvent('upload-button', uploadImage)
  buttonEvent('paste-button', pasteImage)
})

function buttonEvent (id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}
