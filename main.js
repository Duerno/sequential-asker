// Modules to control application life and create native browser window
const electron = require('electron')
const Store = require('electron-store')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')

// Globals to manage application data
const QA_FILE_KEY = 'qa-file'
let appSettings = null
let mainWindow = null

// Create a generic browser window, but do not load an html into it.
function createWindow () {
  // Create the browser window.
  const mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.whenReady().then(() => {
  // Create the application window
  mainWindow = createWindow()

  // Load app settings
  appSettings = new Store()

  // Load Q&A file containg the game data
  const { gameData, err } = loadGameData(appSettings)

  // And load the html of the app
  if (err) {
    mainWindow.loadFile('error.html')
  } else {
    mainWindow.loadFile('game.html')
  }
})

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
electron.app.on('activate', function () {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron.app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') electron.app.quit()
})

// Load game data composed by the ame questions and answers and the game
// end message.
function loadGameData (appSettings) {
  // Read game data location
  const gameDataFilePath = appSettings.get(QA_FILE_KEY)
  if (!gameDataFilePath) {
    // TODO(duerno): add initial game data here
    return { gameData: null, err: 'game data location not found' }
  }

  // Read Q&A file
  let gameDataFile
  try {
    gameDataFile = fs.readFileSync(gameDataFilePath, 'utf8')
  } catch (err) {
    return { gameData: null, err: `file '${gameDataFilePath}' not found` }
  }

  // Parse file
  const rawGameData = YAML.parse(gameDataFile)

  // Validate file
  // TODO(duerno): add validation here

  return { gameData: rawGameData, err: null }
}
