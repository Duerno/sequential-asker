let { ipcRenderer } = require('electron')

ipcRenderer.send('setup-page-loaded', null)

ipcRenderer.on('setup-set-curr-game-data-location', (_, arg) => {
  if (arg.gameDataLocation) {
    document.getElementById('curr-game-data-location').innerText = arg.gameDataLocation
  }
})

ipcRenderer.on('setup-set-game-load-error', (_, arg) => {
  if (arg.err && arg.err.length > 0) {
    document.getElementById('game-load-error').innerHTML = `<p>Seems like the game couldn't start for this reason: ${arg.err}.</p>`
  } else {
    document.getElementById('game-load-error').innerHTML = ''
  }
})

document.getElementById('game-data-form-submit').addEventListener('click', (event) => {
  event.preventDefault()
  let selectedFiles = document.getElementById('game-data-location').files
  if (selectedFiles && selectedFiles.length >= 1) {
    let gameDataLocation = selectedFiles[0].path
    ipcRenderer.send('game-data-location-updated', { gameDataLocation })
  }
})

document.getElementById('start-game-submit').addEventListener('click', (event) => {
  event.preventDefault()
  ipcRenderer.send('setup-ask-to-start-game', null)
})
