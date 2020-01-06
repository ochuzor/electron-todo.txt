// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

'use strict'

const { saveText } = require('./store')

const mainForm = document.getElementById('input-bar-form')
const input = document.getElementById('main-input')

mainForm.addEventListener('submit', handleText)

function handleText(evt) {
    evt.preventDefault()
    const text = evt.target[0].value
    saveText(text).then(() => setInputText(''))
}

function setInputText (text = '') {
    input.value = text
}
