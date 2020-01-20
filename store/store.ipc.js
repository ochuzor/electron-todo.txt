const { ipcRenderer } = require('electron')

const {
    STORE_SAVE_TEXT,
    STORE_DELETE_DOC,
    STORE_GET_ALL_DOCS,
    STORE_SEARCH_DOCS,
    STORE_GET_DOC
} = require('./store.constants')

function saveText(text) {
    return new Promise(resolve => {
        resolve(ipcRenderer.sendSync(STORE_SAVE_TEXT, text))
    })
}

function deleteDoc(id) {
    return new Promise(resolve => {
        resolve(ipcRenderer.sendSync(STORE_DELETE_DOC, id))
    })
}

function getAll() {
    return ipcRenderer.sendSync(STORE_GET_ALL_DOCS)
}

function search(query) {
    return ipcRenderer.sendSync(STORE_SEARCH_DOCS, query)
}

function getItem(id) {
    return ipcRenderer.sendSync(STORE_GET_DOC, id)
}

module.exports.saveText = saveText
module.exports.deleteDoc = deleteDoc
module.exports.getAll = getAll
module.exports.search = search
module.exports.getItem = getItem
