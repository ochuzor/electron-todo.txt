'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
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

function textToData(text) {
    return {text}
}

function saveText(data) {
    return new Promise((resolve) => {
        const _data = _.isString(data) ? textToData(data) : _.cloneDeep(data)
        if (!_data.id) _data.id = parseInt(_.uniqueId(), 10)
        
        indexer.addToIndex(_data)
        saveTextToFile(indexer.toString())
        resolve(_data)
    })
}

function saveTextToFile(text) {
    return new Promise((resolve) => {
        fs.writeFile(DATA_FILE, text, 'utf8', (err) => {
            if (err) throw err
            resolve(data)
        })
    })
}

module.exports.saveText = saveText
