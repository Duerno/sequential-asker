let electron = require('electron')

electron.ipcRenderer.on('setup-set-game-setup-error', (_, arg) => {
  document.getElementById('setup-game-error').innerHTML = `<p>Seems like the game couldn't start for this reason: ${arg.err}.</p>`
})
