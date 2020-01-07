'use strict'

const $ = require('jquery')
const Mousetrap = require('mousetrap')
// const _ = require('lodash')

const {
    getAll,
    search
} = require('../store')

const list = $('#item-list')
const searchInput = $('#search-input')

// const onInputHandler = _.debounce(inputChangeHandler, 250, { 'maxWait': 1000 })
const allItems = getAll()

function inputChangeHandler(e) {
    const term = searchInput.val()
    if (term && term.trim() !== '') {
        const items = search(term) || []
        displayElemets(items)
    } else {
        displayElemets(allItems)
    }
}

searchInput.on('input', inputChangeHandler)

const getListItem = (itm) => {
    return $("<li></li>")
        .text(itm.text)
        .addClass('lst-itm')
        .attr('data-id', itm.id)
        .click(function() {
            const itm = $(this)
            console.log(itm.text(), itm.attr('data-id'))
          })
}

function displayElemets(ls) {
    list.html('')
    ls.forEach(itm => list.append(getListItem(itm)))
}

displayElemets(allItems)

Mousetrap.bind('esc', function() { 
    console.log('escape')
}, 'keyup')
