'use strict';

const Mousetrap = require('mousetrap');

const {
    UIComponent,
    UIContainer
} = require('./ui.components');

const MESSAGE_BOX_KEY = 'MESSAGE_BOX_KEY';
const CONFIRM_BOX_KEY = 'CONFIRM_BOX_KEY';
const messageContainer = new UIContainer();

messageContainer
    .addChild(new UIComponent(MESSAGE_BOX_KEY, '#msg-cntr > div:first'))
    .addChild(new UIComponent(CONFIRM_BOX_KEY, '#msg-cntr > div:nth-child(2)'))
    .hide();

messageContainer.displayMessage = (message, duration = 0) => {
    messageContainer.getChild(MESSAGE_BOX_KEY)
        .setContents(message)
        .show();
    if (duration > 0) setTimeout(messageContainer.hideMessage, duration);
    return messageContainer;
};

messageContainer.hideMessage = () => {
    messageContainer.getChild(MESSAGE_BOX_KEY)
        .setContents('')
        .hide();
    return messageContainer;
}

messageContainer.displayConfirm = (message, fn) => {
    Mousetrap.bind('y', () => {
        messageContainer.closeConfirm();
        if(_.isFunction(fn)) fn();
    }, 'keyup');

    return messageContainer
        .displayMessage(message)
        .show(CONFIRM_BOX_KEY);
}

messageContainer.closeConfirm = () => {
    Mousetrap.unbind('y', 'keyup');
    messageContainer.hide();
}

messageContainer.isShowingConfirm = () => {
    return messageContainer.isShowing(CONFIRM_BOX_KEY);
}

module.exports = messageContainer;
