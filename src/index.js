'use strict'

// instanciando los objetos app y BrowserWindow
import { app, BrowserWindow } from 'electron'
import devtools from './devtools'
import setIpcMain from './ipcMainEvents'
import handleErrors from './handle-errors'

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

  setIpcMain(win)
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
