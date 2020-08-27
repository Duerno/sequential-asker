let { ipcRenderer } = require('electron')

ipcRenderer.send('game-page-loaded', null)

ipcRenderer.on('game-insert-message', (_, arg) => {
  if (arg && arg.owner && arg.message) {
    document.getElementById('messages').innerHTML += `
      <div class="message ${arg.owner}-message">
        <div class="message-text">
          <div>
            ${arg.message}
          </div>
        </div>
      </div>
    `
  }
})

document.getElementById('input-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let userMessage = document.getElementById('input-message').value
  if (userMessage && userMessage.length >= 1) {
    ipcRenderer.send('game-user-message-received', { userMessage })
  }
  document.getElementById('input-message').value = ''
})
