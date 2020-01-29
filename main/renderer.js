'use strict'

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer, remote } = require('electron')
const $ = require('jquery')

const { IpcRendererDataStore } = require('../store-lib/dist')

const mainForm = document.getElementById('input-bar-form')
const input = document.getElementById('main-input')
const ESC_CODE = 27

const dataStore = new IpcRendererDataStore(ipcRenderer)

mainForm.addEventListener('submit', handleText)

function handleText(evt) {
    evt.preventDefault()
    const text = evt.target[0].value.trim()

    if (['ls', 'list'].includes(text.toLowerCase())) {
        ipcRenderer.send('show-items-list')
    } else if (text) {
        dataStore.saveText(text)
    }

    setInputText('')
}

function setInputText (text = '') {
    input.value = text
}

$(document).keyup((e) => {
    if (e.which === ESC_CODE) {
        remote.getCurrentWindow().hide()
    }
})
