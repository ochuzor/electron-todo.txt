'use strict'

const { remote } = require('electron');
const $ = require('jquery');
const Mousetrap = require('mousetrap');
const _ = require('lodash');

const {
    getAll,
    search,
    getItem
} = require('../store');
const {parseTodoStr} = require('../todo.parser');

const list = $('#item-list')
const searchInput = $('#search-input')
const itemListCntr = $('#main-cntr > div:first');
const itemDetailCntr = $('#main-cntr > div:nth-child(2)');
const detailsText = $('#main-cntr > div:nth-child(2) > textarea');
const detailsList = $('#main-cntr > div:nth-child(2) > ul');

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

function onItemTextChange(e) {
    const data = parseTodoStr($(this).val());
    renderDetailsList(data);
}

const getItemDetailField = (val, idx) => {
    const title = $('<span>').html(`${_.startCase(idx)}: `);
    const valTxt = $('<span class="item-info">').html(`${val}`);
    return $('<li>').append(title).append(valTxt);
};

function renderDetailsList(itemData) {
    const childs = _.map(_.omit(itemData, ['text']), getItemDetailField);
    return detailsList.html(childs);
};

function updateDisplay() {
    if (pageData.selectedItem) {
        const text = pageData.selectedItem.text;
        detailsText.val(text);
        renderDetailsList(parseTodoStr(text));

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
}, 'keyup');

/*
function onKeyDown() {
    console.log('arrow down');
}

Mousetrap.bind('down', _.debounce(onKeyDown, 250, { 'maxWait': 1000 }));
// */

(() => {
    detailsText.on('input', _.debounce(onItemTextChange, 250, { 'maxWait': 1000 }));
    itemDetailCntr.hide();
    displayElemets(allItems);
})();
