import { ipcRenderer, remote } from 'electron'
import settings from 'electron-settings'
import { clearImages, loadImages, addImageEvents, selectFirstImage } from './images-ui'
import { saveImage } from './filters'
import Client from 'ftp'
import crypto from 'crypto'
import path from 'path'
import os from 'os'
// este funciona en el lado del proceso de renderizado

function setIpc () {
  if (settings.has('directory')) {
    ipcRenderer.send('load-directory', settings.get('directory'))
  }

  ipcRenderer.on('load-images', (event, dir, images) => {
    clearImages()
    loadImages(images)
    addImageEvents()
    selectFirstImage()
    settings.set('directory', dir)
    document.getElementById('directory').innerHTML = dir
  })

  ipcRenderer.on('save-image', (event, file) => {
    saveImage(file, (err) => {
      if (err) return showDialog('error', 'Platzipics', err.message)
      document.getElementById('image-displayed').dataset.filtered = file
      showDialog('info', 'Platzipics', 'La imagen fue guardada')
    })
  })
}

function openPreferences (){
  const BrowserWindow = remote.BrowserWindow
  const mainWindow = remote.getGlobal('win')

  const preferencesWindow = new BrowserWindow({
    width: 400,
    heigth: 300,
    title: 'Preferencias',
    center: true,
    modal: true,
    frame: false,
    show: false
  })

  if (os.platform() !== 'wind32') {
    preferencesWindow.setParentWindow(mainWindow)
  }
  preferencesWindow.setParentWindow(mainWindow)
  preferencesWindow.once('ready-to-show', () => {
    preferencesWindow.show()
    preferencesWindow.focus()
  })
  preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)
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

function uploadImage () {
  let imageNode = document.getElementById('image-displayed')
  let image
  if (imageNode.dataset.filtered) {
    image = imageNode.dataset.filtered
  } else {
    image = imageNode.src
  }

  image = image.replace('file://', '')
  let fileName = path.basename(image)

  if (settings.has('cloudup.user') && settings.has('cloudup.passwd')) {
    // El código de debajo no es utilizado ya que se accede a FTP anónimo
    // const decipher = crypto.createDecipher('aes192', 'Platzipics')
    // let decrypted = decipher.update(settings.get('cloudup.passwd'), 'hex', 'utf8')
    // decrypted += decipher.final('utf8')

    let client = new Client()
    client.on('ready', () => {
      console.log('Connected successfully and uploading image: ', fileName)
      client.put(image, fileName, (err) => {
        if (err) {
          showDialog('error', 'Platzipics', `Error al cargar archivo al FTP ${err}`)
        } else {
          showDialog('info', 'Platzipics', `Imagen cargada con éxito`)          
        }
        client.end()
      })
    })
    client.on('error', (err) => {
      showDialog('error', 'Platzipics', `Verifique su conexión y/o sus credenciales ${err}`)
    })
    client.connect({
      host: '192.168.1.135',
      port: 21,
      user: 'anonymous',
      password: 'anonymous@'
    })

  } else {
    showDialog('error', 'Platzipics', 'Por favor complete las preferencias de cloudup')
  }
}

module.exports = {
  setIpc: setIpc,
  openDirectory: openDirectory,
  saveFile,
  openPreferences,
  uploadImage
}
