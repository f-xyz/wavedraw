define(['utils', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');

    var DomEvents = utils.Class({

        constructor: function DomEvents() {
            document.addEventListener('keypress', this.onKeypress.bind(this));
            document.addEventListener('click', this.onClick.bind(this));
            document.addEventListener('mousemove', this.onClick.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));
        },

        onKeypress: function(e) {
            if (e.keyCode === 32) {
                sandbox.trigger('domEvents.toggle');
            } else if (e.keyCode === 13) {
                sandbox.trigger('domEvents.once');
            } else if (e.keyCode === 8) {
                sandbox.trigger('domEvents.back');
            }
        },

        onClick: function(e) {
            sandbox.trigger('domEvents.add', {
                x: e.clientX,
                y: e.clientY
            });
        },

        onResize: function() {
            sandbox.trigger('domEvents.resize');
        }
    });

    return new DomEvents();
});
