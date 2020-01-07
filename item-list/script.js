'use strict'

const $ = require('jquery')
const Mousetrap = require('mousetrap')

const { getAll } = require('../store')

const searchForm = $(".search-bar")
const list = $('#item-list')

const allItems = getAll()

const getListItem = (itm) => {
    return $("<li></li>")
        .text(itm.text)
        .addClass('lst-itm')
        .click(function(){
            // $(this).hide();
            console.log($(this).text())
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
