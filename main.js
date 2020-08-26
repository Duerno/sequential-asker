// Modules to control application life and create native browser window
const electron = require('electron')
const path = require('path')

// Internal modules to control the game
const appController = require('./src/js/controller')

// Create a generic browser window, but do not load an html into it.
function createWindow() {
  // Create the browser window.
  const window = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Open the DevTools.
  // window.webContents.openDevTools()

  return window
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.whenReady().then(() => {
  // Initialize the app
  appController.loadApp(createWindow())

  // Register shortcut for the game setup page
  electron.globalShortcut.register('CommandOrControl+Shift+P', () => {
    appController.openGameSetup()
  })
})

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
electron.app.on('activate', function () {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    appController.loadApp(createWindow())
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') electron.app.quit()
})
