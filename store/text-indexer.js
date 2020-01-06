'use strict'

const _ = require('lodash')
const FlexSearch = require('flexsearch')

class TextIndexer {
    constructor (opts) {
        this._indexer = new FlexSearch(opts)
    }

    initWith (data) {
        this._indexer.import(data)
    }

    getDocument (id) {
        return _.cloneDeep(this._indexer.find(id))
    }

    getAll () {
        const data = JSON.parse(this._indexer.export({index: false, doc: true}))
        const docs = _.values(_.first(data))
        return docs
    }

    // doc: {id: , text: ''}
    addToIndex (doc) {
        this._indexer.add(doc)
    }

    removeFromIndex (id) {
        this._indexer.remove({id})
    }

    search (term) {
        return _.cloneDeep(this._indexer.search(term))
    }

    toString () {
        return this._indexer.export()
    }
}

module.exports.TextIndexer = TextIndexer
