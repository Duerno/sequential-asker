'use strict'

// Import modules
const { ipcMain } = require('electron')
const fs = require('fs')
const YAML = require('yaml')

// Module internal globals to manage application data
let gameState = {
  questionNumber: 0,
  finalMessageSent: false,
  gameData: null,
}

module.exports = {
  // loadGame: loads the game data
  async loadGame(gameDataLocation) {
    return loadGameData(gameDataLocation)
  }
}

// Load game data composed by the ame questions and answers and the game
// end message.
function loadGameData(gameDataLocation) {
  // Read game data location
  if (!gameDataLocation) {
    return 'invalid game data location'
  }

  // Read game data file
  let gameDataFile
  try {
    gameDataFile = fs.readFileSync(gameDataLocation, 'utf8')
  } catch (err) {
    return `failed read game data: ${err}`
  }

  // Parse game data
  let rawGameData
  try {
    rawGameData = YAML.parse(gameDataFile)
  } catch (err) {
    return `failed parse game data: ${err}`
  }

  // Validate file
  // TODO(duerno): add validation here

  gameState.gameData = rawGameData
  return null
}

// Initialize the game conversation
function initConversation() {
  gameState.questionNumber = 0
  gameState.finalMessageSent = false
  return gameState.gameData.questions[0].statement
}

// Get the game answer for the user message and update game state
function gameAnswer(userMessage) {
  if (gameState.finalMessageSent) {
    return null
  }

  const currQuestion = gameState.gameData.questions[gameState.questionNumber]
  if (userMessage != currQuestion.feedback) {
    return currQuestion.statement
  }

  if (gameState.questionNumber + 1 < gameState.gameData.questions.length) {
    gameState.questionNumber += 1
    const nextQuestion = gameState.gameData.questions[gameState.questionNumber]
    return nextQuestion.statement
  }

  gameState.finalMessageSent = true
  return gameState.gameData.finalMessage
}

/*
 * Event handlers
 */

// On game page loaded
ipcMain.on('game-page-loaded', (event, _) => {
  event.sender.send('game-insert-message', { owner: 'game', message: initConversation() })
})

// On game user message received
ipcMain.on('game-user-message-received', (event, arg) => {
  console.log('on.game-user-message-received.userMessage', arg.userMessage)

  event.sender.send('game-insert-message', { owner: 'user', message: arg.userMessage })

  let answer = gameAnswer(arg.userMessage)
  if (answer) {
    event.sender.send('game-insert-message', { owner: 'game', message: answer })
  }
})
