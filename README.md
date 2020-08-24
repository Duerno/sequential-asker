# sequential-asker

_Sequential Asker_ is a multi-platform desktop game of questions and answers built with [Electron](https://electronjs.org).

## Getting started

From your command line:

```bash
# Install dependencies
npm install
# Run the app
npm start
```

## How the app works

When the app starts, it loads an .yaml file containing a sequence of questions and their correct answers. After the file is loaded, it displays the first question, a text field for the user to write their answer, and a button to check whether the answer is correct.

Once the correct answer is found, the app moves on to the next question. After the last question is answered correctly, the app displays a final message and does nothing else.

> Note: if the file is invalid or does not exist, the app displays an error message and does nothing else.

You can open the app settings by using the shortcut `Cmd + ,`. There it is possible to change:
- The path of the file with the questions and answers.
