'use strict'

const $ = require('jquery')

const { getAll } = require('../store')

const searchForm = $(".search-bar")
const list = $('#item-list')

const allItems = getAll()

function displayElemets(ls) {
    list.html('')
    ls.forEach(itm => {
        list.append($("<li></li>").text(itm.text))
    })
}

displayElemets(allItems)
