'use strict'

const fs = require('fs')
const YAML = require('yaml')
const Store = require('electron-store')
const { ipcMain } = require('electron')

module.exports = {
  /*
   * loadApp: initializes the app
   */
  async loadApp(window) {
    // Set app window
    appWindow = window

    // Load app preferences
    appPreferences = new Store()

    // Load game
    loadGame()
  },

  /*
   * openGameSetup: opens the game setup page
   */
  async openGameSetup() {
    // Load the game setup page
    console.log('openGameSetup.loading setup page...')
    appWindow.loadFile('./src/html/setup.html')
    ipcMain.on('setup-page-loaded', (event, _) => {
      event.sender.send('setup-set-curr-game-data-location', { gameDataLocation: appPreferences.get(GAME_DATA_KEY) })
    })
  }
}

// Module internal globals to manage application data
let appWindow = null
let appPreferences = null
const GAME_DATA_KEY = 'game-data-file-location'

// Loads the game
function loadGame() {
  // Load game data file
  const { gameData, err } = loadGameData()

  // Load the initial html of the app
  if (err) {
    console.log('loadGame.loading setup page...')
    appWindow.loadFile('./src/html/setup.html')
    ipcMain.on('setup-page-loaded', (event, _) => {
      event.sender.send('setup-set-curr-game-data-location', { gameDataLocation: appPreferences.get(GAME_DATA_KEY) })
      event.sender.send('setup-set-game-setup-error', { err })
    })
  } else {
    console.log('loadGame.loading game page...')
    appWindow.loadFile('./src/html/game.html')
  }

  // Show window when page is ready
  appWindow.once('ready-to-show', () => {
    appWindow.show()
  })
}

// Load game data composed by the ame questions and answers and the game
// end message.
function loadGameData() {
  // Read game data location
  const gameDataLocation = appPreferences.get(GAME_DATA_KEY)
  console.log('loadGameData.gameDataLocation', gameDataLocation)
  if (!gameDataLocation) {
    // TODO(duerno): add initial game data here
    return { gameData: null, err: 'invalid game data file location' }
  }

  // Read game data file
  let gameDataFile
  try {
    gameDataFile = fs.readFileSync(gameDataLocation, 'utf8')
  } catch (err) {
    return { gameData: null, err: `failed read game data: ${err}` }
  }

  // Parse game data
  let rawGameData
  try {
    rawGameData = YAML.parse(gameDataFile)
  } catch (err) {
    return { gameData: null, err: `failed parse game data: ${err}` }
  }

  // Validate file
  // TODO(duerno): add validation here

  return { gameData: rawGameData, err: null }
}

/*
 * Event handlers
 */

// On game data location is updated
ipcMain.on('setup-game-data-location-updated', (_, arg) => {
  appPreferences.set(GAME_DATA_KEY, arg.gameDataLocation)
  // TODO(duerno): fix game page not loaded
  loadGame()
})
