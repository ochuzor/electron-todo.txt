'use strict'

const _ = require('lodash')
const { TextIndexer } = require('./text-indexer')

function textToData(text) {
    return {text}
}

function saveText(data) {
    return new Promise((resolve) => {
        const _data = _.isString(data) ? textToData(data) : _.cloneDeep(data)
        if (!_data.id) _data.id = parseInt(_.uniqueId(), 10)
        console.log('saving ->', _data)
        resolve(_data)
    })
}

module.exports.saveText = saveText
