import { ipcRenderer } from 'electron'
import { clearImages, loadImages, addImageEvents, selectFirstImage } from './images-ui'
import { saveImage } from './filters'
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
    saveImage(file, (err) => {
      if (err) return showDialog('error', 'Platzipics', err.message)
      showDialog('info', 'Platzipics', 'La imagen fue guardada')
    })
  })
}

function openDirectory () {
  ipcRenderer.send('open-directory')
}

function showDialog (type, title, msg) {
  ipcRenderer.send('show-dialog', {type: type, title: title, message: msg})
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
