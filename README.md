# sequential-asker

_Sequential Asker_ is a multi-platform desktop game of questions and answers built with [Electron](https://electronjs.org).

## How the game works

When the app starts, it loads an `.yaml` file containing the game data. This data must contain the sequence of questions (composed by their statements and feedbacks) and the final game message. Below is shown an example of a valid game data file:

```yaml
questions:
  - statement: 'ping'
    feedback: 'pong'
  - statement: 'abre'
    feedback: 'fecha'

finalMessage: 'the end'
```

After the file is loaded, a game begins in a typical messaging app conversation. In this conversation, the game asks the first question and the user must write an answer for that. If the user writes the wrong answer, the game sends the same question again. Once the user writes the correct answer, the game asks the next question. After the last question is answered correctly, the game sends a final message and answers no more player messages.

> Note: if the game data file is invalid or does not exist, the app displays a setup message and waits.

You can open the app preferences by using the shortcut `CmdORCtrl + Shift + P`. There, it is possible to change the path of the game data file.

## Getting started

Run the commands below from the root of this repository using a terminal:

```bash
# Install dependencies
npm install
# Run the app
npm start
# Build app installers
yarn dist
```
