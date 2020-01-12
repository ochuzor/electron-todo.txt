'use strict'

const { remote } = require('electron')
const $ = require('jquery')
const Mousetrap = require('mousetrap')
// const _ = require('lodash')

const {
    getAll,
    search,
    getItem
} = require('../store')

const list = $('#item-list')
const searchInput = $('#search-input')
const itemListCntr = $('#main-cntr > div:first');
const itemDetailCntr = $('#main-cntr > div:nth-child(2)');

const pageData = Object.create(null);
pageData.selectedItem = null;

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

function showItem(item) {
    pageData.selectedItem = item;
    updateDisplay();
}

function handleItemClick() {
    const itmId = $(this).attr('data-id');
    showItem(getItem(itmId));
    // console.log(itm.text(), itm.attr('data-id'))
}

const getListItem = (itm) => {
    return $("<li></li>")
        .text(itm.text)
        .addClass('lst-itm')
        .attr('data-id', itm.id)
        .click(handleItemClick);
}

function displayElemets(ls) {
    list.html('')
    ls.forEach(itm => list.append(getListItem(itm)))
}

function closeWindow() {
    remote.getCurrentWindow().close()
}

function closeItemDetail() {
    pageData.selectedItem = null;
    updateDisplay();
}

function updateDisplay() {
    if (pageData.selectedItem) {
        itemDetailCntr.html(JSON.stringify(pageData.selectedItem, null, '\t'));
        itemDetailCntr.show();
        itemListCntr.hide();
    } else {
        itemDetailCntr.hide();
        itemListCntr.show();
    }
}

Mousetrap.bind('esc', () => {
    if (pageData.selectedItem) {
        closeItemDetail();
    }
    else closeWindow();
}, 'keyup')

displayElemets(allItems)
