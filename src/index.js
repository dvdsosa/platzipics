'use strict'

// instanciando los objetos app y BrowserWindow
import { app, BrowserWindow, Tray, globalShortcut, protocol } from 'electron'
import devtools from './devtools'
import setIpcMain from './ipcMainEvents'
import handleErrors from './handle-errors'
import os from 'os'
import path from 'path'

if (process.env.NODE_ENV === 'development') {
  devtools()
}

global.win  // eslint-disable-line
global.tray // eslint-disable-line
// console.dir(app)

// imprimiendo un mensaje en la consola antes de salir
app.on('before-quit', () => {
  console.log('Saliendo...')
  globalShortcut.unregisterAll()
})

// Ejecutando órdenes cuando la aplicación está lista
app.on('ready', () => {
  protocol.registerFileProtocol('plp', (request, callback) => {
    const url = request.url.substr(6) // porque es plp:// que son 6 caracteres
    callback({path: path.normalize(url)}) // eslint-disable-line
  }, (err) => {
    if (err) throw err
  })

  // creando una ventana
  global.win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Platzipics',
    center: true,
    maximizable: false,
    show: false,
    icon: path.join(__dirname, 'assets', 'icons', 'main-icon.png')
  })

  globalShortcut.register('CommandOrControl+Alt+p', () => {
    global.win.show()
    global.win.focus()
  })
  setIpcMain(global.win)
  handleErrors(global.win)

  global.win.once('ready-to-show', () => {
    global.win.show()
  })

  global.win.on('move', () => {
    const position = global.win.getPosition()
    console.log(`la posición es ${position}`)
  })
  // detectando el cierre de la ventana para cerrar el aplicativo
  global.win.on('close', () => {
    // para que no quede en memoria el objeto que visualiza la ventana
    global.win = null
    app.quit()
  })

  let icon
  if(os.platform() === 'win32') {
    icon = path.join(__dirname, 'assets','icons','tray-icon.ico')
  } else {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  }

  global.tray = new Tray(icon)
  global.tray.setToolTip('Platzipics')
  global.tray.on('click', () => {
    global.win.isVisible() ? global.win.hide() : global.win.show()
  })

  // global.win.loadURL('http://devdocs.io/')
  global.win.loadURL(`file://${__dirname}/renderer/index.html`)
  //global.win.toggleDevTools()
})
