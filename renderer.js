// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

'use strict'

const { ipcRenderer } = require('electron')
const { saveText } = require('./store')

const mainForm = document.getElementById('input-bar-form')
const input = document.getElementById('main-input')

mainForm.addEventListener('submit', handleText)

function handleText(evt) {
    evt.preventDefault()
    const text = evt.target[0].value.trim()

    if (['ls', 'list'].includes(text.toLowerCase())) {
        ipcRenderer.send('show-items-list')
    } else {
        saveText(text)
    }

    setInputText('')
}

function setInputText (text = '') {
    input.value = text
}
