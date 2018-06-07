'use strict'

// instanciando los objetos app y BrowserWindow
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import devtools from './devtools'
import handleErrors from './handle-errors'
import isImage from 'is-image'
import filesize from 'filesize'
import fs from 'fs'
import path from 'path'

if (process.env.NODE_ENV === 'development') {
  devtools()
}

let win
// console.dir(app)

// imprimiendo un mensaje en la consola antes de salir
app.on('before-quit', () => {
  console.log('Saliendo...')
})

// Ejecutando órdenes cuando la aplicación está lista
app.on('ready', () => {
  // creando una ventana
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Platzipics',
    center: true,
    maximizable: false,
    show: false
  })

  handleErrors(win)

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('move', () => {
    const position = win.getPosition()
    console.log(`la posición es ${position}`)
  })
  // detectando el cierre de la ventana para cerrar el aplicativo
  win.on('close', () => {
    // para que no quede en memoria el objeto que visualiza la ventana
    win = null
    app.quit()
  })

  // win.loadURL('http://devdocs.io/')
  win.loadURL(`file://${__dirname}/renderer/index.html`)
  win.toggleDevTools()
})

ipcMain.on('open-directory', (event) => {
  dialog.showOpenDialog(win, {
    title: 'Selecciona la nueva ubicación',
    buttonLabel: 'Abrir ubicación',
    properties: ['openDirectory']
  },
  (dir) => {
    const images = []
    if (dir) {
      fs.readdir(dir[0], (err, files) => {
        if (err) throw err

        for (let i = 0; i < files.length; i++) {
          if (isImage(files[i])) {
            let imageFile = path.join(dir[0], files[i])
            let stats = fs.statSync(imageFile)
            let size = filesize(stats.size, {round: 0})
            images.push({
              filename: files[i],
              src: `file://${imageFile}`,
              size: size
            })
          }
        }

        event.sender.send('load-images', images)
      })
    }
  })
})

ipcMain.on('open-save-dialog', (event, ext) => {
  dialog.showSaveDialog(win, {
    title: 'Guardar imagen modificada',
    buttonLabel: 'Guardar imagen',
    filters: [{name: 'Images', extensions: [ext.substr(1)]}]
  },
  file => {
    if (file) {
      event.sender.send('save-image', file)
    }
    console.log(file)
  })
})

ipcMain.on('show-dialog', (event, info) => {
  dialog.showMessageBox(win, {
    type: info.type,
    title: info.title,
    message: info.message
  })
})