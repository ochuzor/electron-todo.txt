'use strict';

const { remote } = require('electron');
const $ = require('jquery');
const Mousetrap = require('mousetrap');
const _ = require('lodash');

const {
    getAll,
    search,
    getItem,
    saveText,
    deleteDoc
} = require('../store');
const { parseTodoStr } = require('../todo.parser');
const messageContainer = require('./message-box');

const list = $('#item-list')
const searchInput = $('#search-input');
const itemListCntr = $('#main-cntr > div:first');
const itemDetailCntr = $('#main-cntr > div:nth-child(2)');
const detailsText = $('#main-cntr > div:nth-child(2) > textarea');
const detailsList = $('#main-cntr > div:nth-child(2) > ul');
const DEFAULT_MESSAGE_DISPLAY_TIME = 5000; // 5 seconds

const pageData = Object.create(null);
pageData.selectedItem = null;
pageData.allItems = getAll();

function inputChangeHandler(e) {
    const term = searchInput.val()
    if (term && term.trim() !== '') {
        const items = search(term) || []
        displayElemets(items)
    } else {
        displayElemets(pageData.allItems)
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
    list.html(_.map(ls, getListItem));
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

function getItemDetailString(key, val) {
    if (key === 'tags' || _.isArray(val)) return JSON.stringify(val);

    return val.toString();
}

const getItemDetailField = (val, idx) => {
    const title = $('<span>').html(`${_.startCase(idx)}: `);
    const valTxt = $('<span class="item-info">').html(getItemDetailString(idx, val));
    return $('<li class="padding-10 dtl-lst-itm">').append(title).append(valTxt);
};

function renderDetailsList(itemData) {
    const childs = _.reduce(_.omit(itemData, ['text']), (acc, val, key) => {
        if (!_.isEmpty(val)) acc.push(getItemDetailField(val, key));
        return acc;
    }, []);

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

const textToData = (text) => {
    return { text };
}

function saveEdit() {
    if (pageData.selectedItem) {
        const data = textToData(detailsText.val());
        data.id = pageData.selectedItem.id;

        saveText(data)
            .then(() => messageContainer.displayMessage('item saved', DEFAULT_MESSAGE_DISPLAY_TIME))
            .catch(err => messageContainer.displayMessage('Error saving item', err.message));
    }
}

function reloadAll() {
    setTimeout(() => {
        searchInput.val('');
        pageData.allItems = _.reverse(getAll());
        displayElemets(pageData.allItems);
    }, 300);
}

Mousetrap.bind('ctrl+s', saveEdit, 'keyup');

Mousetrap.bind('esc', () => {
    if (messageContainer.isShowing()) {
        messageContainer.hide();
    } else if (pageData.selectedItem) {
        closeItemDetail();
        reloadAll();
    }
    else closeWindow();
}, 'keyup');

Mousetrap.bind('ctrl+del', () => {
    if (pageData.selectedItem) {
        deleteDoc(pageData.selectedItem.id);
        messageContainer.hide();
        messageContainer.displayConfirm('Delete item?', () => {
            console.log('item deleted!');
            reloadAll();
            closeItemDetail();
        });
    }
}, 'keyup');

(() => {
    detailsText.on('input', _.debounce(onItemTextChange, 250, { 'maxWait': 1000 }));
    itemDetailCntr.hide();
    reloadAll();
})();
