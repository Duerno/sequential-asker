let { ipcRenderer } = require('electron')

ipcRenderer.send('game-page-loaded', null)

ipcRenderer.on('game-insert-message', (_, arg) => {
  if (arg && arg.owner && arg.message) {
    let newMessage = document.getElementById('conversation-table-body').insertRow().insertCell()
    newMessage.setAttribute('class', `${arg.owner}-message`)
    newMessage.innerText = arg.message
  }
})

document.getElementById('user-message-form').addEventListener('submit', (event) => {
  event.preventDefault()
  let userMessage = document.getElementById('user-message-input').value
  if (userMessage && userMessage.length >= 1) {
    ipcRenderer.send('game-user-message-received', { userMessage })
  }
  document.getElementById('user-message-input').value = ''
})
