'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const shortid = require('shortid')

const { TextIndexer } = require('./text-indexer')

const DATA_FOLDER = path.join(__dirname, '../data')
const DATA_FILE = path.join(DATA_FOLDER, 'data.txt')
const indexOpts = {
    doc: {
        id: 'id',
        field: ['text']
    }
}

const indexer = new TextIndexer(indexOpts)

;(async (file) => {
    if (fs.existsSync(file)) {
        await loadData(file)
    }
})(DATA_FILE)

function textToData(text) {
    return {text}
}

function saveText(data) {
    return new Promise((resolve) => {
        const _data = _.isString(data) ? textToData(data) : _.cloneDeep(data)
        if (!_data.id) _data.id = shortid.generate()
        
        indexer.addToIndex(_data)
        saveTextToFile(indexer.toString())
        resolve(_data)
    })
}

function deleteDoc(id) {
    return new Promise(resolve => {
        indexer.removeFromIndex(id)
        saveTextToFile(indexer.toString())
        resolve(id)
    })
}

function saveTextToFile(text) {
    return new Promise((resolve) => {
        fs.writeFile(DATA_FILE, text, 'utf8', (err) => {
            if (err) throw err
            resolve(text)
        })
    })
}

function loadData(file) {
    return new Promise((resolve) => {
        const data = fs.readFileSync(file, 'utf8')
        indexer.initWith(data)
        resolve(data)
    })
}

module.exports.saveText = saveText
module.exports.search = indexer.search.bind(indexer)
module.exports.getAll = indexer.getAll.bind(indexer)
module.exports.getItem = indexer.getDocument.bind(indexer)
module.exports.deleteDoc = deleteDoc
