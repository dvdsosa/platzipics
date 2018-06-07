import { ipcRenderer } from 'electron'
import { clearImages, loadImages, addImageEvents, selectFirstImage } from './images-ui'
import path from 'path'
// este funciona en el lado del proceso de renderizado

function setIpc () {
  ipcRenderer.on('load-images', (event, images) => {
    clearImages()
    loadImages(images)
    addImageEvents()
    selectFirstImage()
  })

  ipcRenderer.on('save-image', (event, file) => {
    console.log(file)
  })
}

function openDirectory () {
  ipcRenderer.send('open-directory')
}

function saveFile () {
  const image = document.getElementById('image-displayed').dataset.original
  const ext = path.extname(image)

  ipcRenderer.send('open-save-dialog', ext)
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  saveFile
}
