'use strict'

// Import modules
const { ipcMain } = require('electron')
const Store = require('electron-store')

// Import internal modules
const gameController = require('./game-controller')

// Define internal globals to manage application data
let appWindow = null
let appPreferences = null
const GAME_DATA_KEY = 'game-data-file-location'

module.exports = {
  // loadApp: initializes the app
  async loadApp(window) {
    appWindow = window
    appPreferences = new Store()
    loadInitialPage()
  },

  // openSetupPage: opens the game setup page
  async openSetupPage() {
    console.log('openSetupPage.loading setup page...')
    ipcMain.on('setup-page-loaded', (event, _) => {
      event.sender.send('setup-set-curr-game-data-location', { gameDataLocation: getGameDataLocation() })
    })
    appWindow.loadFile('./src/html/setup.html')
  }
}

// Loads the initial app page
async function loadInitialPage() {
  // Try to load the game
  const err = await gameController.loadGame(getGameDataLocation())

  // Load the initial html of the app
  if (err) {
    console.log('loadInitialPage.loading setup page...')
    ipcMain.on('setup-page-loaded', (event, _) => {
      event.sender.send('setup-set-curr-game-data-location', { gameDataLocation: getGameDataLocation() })
      event.sender.send('setup-set-game-load-error', { err })
    })
    appWindow.loadFile('./src/html/setup.html')
  } else {
    console.log('loadInitialPage.loading game page...')
    appWindow.loadFile('./src/html/game.html')
  }
}

// Get the game data file location saved in app preferences
function getGameDataLocation() {
  return appPreferences.get(GAME_DATA_KEY)
}

/*
 * Event handlers
 */

// On game data location is updated
ipcMain.on('game-data-location-updated', (_, arg) => {
  appPreferences.set(GAME_DATA_KEY, arg.gameDataLocation)
  loadInitialPage()
})
