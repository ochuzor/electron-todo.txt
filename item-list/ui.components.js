'use strict';

const $ = require('jquery');
const _ = require('lodash');

class UIComponent {
    constructor(name, html) {
        this.name = name;
        this.jqHtml = $(html);
        this.jqHtml.hide();
        this._isShowing = false;
    }

    isShowing() {
        return this._isShowing;
    }

    setContents(html) {
        this.jqHtml.html(html);
        return this;
    }

    show() {
        this.jqHtml.show();
        this._isShowing = true;
        return this;
    }

    hide() {
        this.jqHtml.hide();
        this._isShowing = false;
        return this;
    }

    on(eventName, fn) {
        this.jqHtml.on(eventName, fn);
        return this;
    }
}

class UIContainer {
    constructor() {
        this.childs = Object.create(null);
    }

    addChild(child) {
        if (child instanceof UIComponent) {
            this._addChildComponent(child);
            return this;
        }

        if (child instanceof UIContainer) {
            _.forEach(child.childs, this._addChildComponent);
            return this;
        }

        throw new Error('Invalid UIComponent');
    }

    _addChildComponent(child) {
        this.childs[child.name] = child;
    }

    show(name) {
        if (name) this.childs[name].show();
        else {
            _.forEach(this.childs, (child) => {
                child.show();
            });
        }

        return this;
    }

    hide(name) {
        if (name) this.childs[name].hide();
        else {
            _.forEach(this.childs, (child) => {
                child.hide();
            });
        }

        return this;
    }

    getChild(name) {
        return this.childs[name];
    }

    isShowing(name) {
        if (name) {
            const child = this.childs[name];
            return !!child && child.isShowing();
        }

        return _.some(this.childs, (child) => child.isShowing());
    }
}

module.exports.UIComponent = UIComponent;
module.exports.UIContainer = UIContainer;
