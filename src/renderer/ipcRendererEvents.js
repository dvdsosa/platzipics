import { ipcRenderer } from 'electron'
import { clearImages, loadImages, addImageEvents, selectFirstImage } from './images-ui'

// este funciona en el lado del proceso de renderizado

function setIpc () {
  ipcRenderer.on('load-images', (event, images) => {
    clearImages()
    loadImages(images)
    addImageEvents()
    selectFirstImage()
  })
}

function openDirectory () {
  ipcRenderer.send('open-directory')
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory
}
