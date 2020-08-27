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
  loadApp(window) {
    appWindow = window
    appPreferences = new Store()
    loadInitialPage()
  },

  // openSetupPage: opens the game setup page
  openSetupPage() {
    loadSetupPage()
  }
}

// Loads the initial app page
function loadInitialPage() {
  // Try to load the game
  const err = gameController.loadGame(getGameDataLocation())

  // Load the initial html of the app
  if (err) {
    loadSetupPage()
  } else {
    loadGamePage()
  }
}

// Load setup page
function loadSetupPage() {
  const err = gameController.loadGame(getGameDataLocation())
  ipcMain.on('setup-page-loaded', (event, _) => {
    event.sender.send('setup-set-game-load-error', { err })
    event.sender.send('setup-set-curr-game-data-location', {
      gameDataLocation: getGameDataLocation()
    })
  })
  appWindow.loadFile('./src/html/setup.html')
}

// Load game page
function loadGamePage() {
  appWindow.loadFile('./src/html/game.html')
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
  loadSetupPage()
})

// On request to start game
ipcMain.on('setup-ask-to-start-game', () => {
  loadInitialPage()
})
