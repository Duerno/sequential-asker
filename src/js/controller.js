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

    // Load game data file
    const { gameData, err } = loadGameData()

    // Load the initial html of the app
    if (err) {
      appWindow.loadFile('./src/html/setup.html')
      ipcMain.on('setup-page-loaded', (event, _) => {
        event.sender.send('setup-set-game-setup-error', { err } )
      })
    } else {
      appWindow.loadFile('./src/html/game.html')
    }
  },

  /*
   * openGameSetup: opens the game setup page
   */
  async openGameSetup() {
    // Load the game setup page
    appWindow.loadFile('./src/html/setup.html')
  }
}

// Module internal globals to manage application data
let appWindow = null
let appPreferences = null
const GAME_DATA_KEY = 'game-data-file-location'

// Load game data composed by the ame questions and answers and the game
// end message.
function loadGameData() {
  // Read game data location
  const gameDataFilePath = appPreferences.get(GAME_DATA_KEY)
  if (!gameDataFilePath) {
    // TODO(duerno): add initial game data here
    return { gameData: null, err: 'invalid game data file location' }
  }

  // Read game data file
  let gameDataFile
  try {
    gameDataFile = fs.readFileSync(gameDataFilePath, 'utf8')
  } catch (err) {
    return { gameData: null, err: `failed to find game data file '${gameDataFilePath}'` }
  }

  // Parse file
  const rawGameData = YAML.parse(gameDataFile)

  // Validate file
  // TODO(duerno): add validation here

  return { gameData: rawGameData, err: null }
}
