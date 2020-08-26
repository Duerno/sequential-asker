// Modules to control application life and create native browser window
const electron = require('electron')

// Internal modules to control the application
const appController = require('./src/js/app-controller')

// Create a generic browser window, but do not load an html into it.
function createWindow() {
  return new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.whenReady().then(() => {
  // Initialize the app
  appController.loadApp(createWindow())

  // Register shortcut for the setup page
  electron.globalShortcut.register('CommandOrControl+Shift+P', () => {
    appController.openSetupPage()
  })
})

// Quit when all windows are closed.
electron.app.on('window-all-closed', function () {
  electron.app.quit()
})
