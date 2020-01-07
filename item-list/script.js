'use strict'

const $ = require('jquery')

const { getAll } = require('../store')

const searchForm = $(".search-bar")
const list = $('#item-list')

const allItems = getAll()

const getListItem = (itm) => {
    return $("<li></li>").text(itm.text).addClass('lst-itm')
}

function displayElemets(ls) {
    list.html('')
    ls.forEach(itm => list.append(getListItem(itm)))
}

displayElemets(allItems)
