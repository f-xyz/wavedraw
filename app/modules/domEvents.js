define(['utils', 'modules/sandbox', 'modules/viewport'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var viewport = require('modules/viewport');

    var DomEvents = utils.Class({

        constructor: function DomEvents() {
            document.addEventListener('keydown', this.onKeypress.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));

            this.drawing = false;
            viewport.canvas.addEventListener('click', this.onClick.bind(this));
            viewport.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
            viewport.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
            viewport.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        },

        onKeypress: function(e) {
            if (e.keyCode === 32) {
                sandbox.trigger('domEvents.toggle');
            } else if (e.keyCode === 13) {
                sandbox.trigger('domEvents.once');
            } else if (e.keyCode === 27) {
                sandbox.trigger('domEvents.clear');
            }
        },

        onClick: function(e) {
            sandbox.trigger('domEvents.add', {
                x: e.clientX - e.target.offsetLeft,
                y: e.clientY - e.target.offsetTop
            });
        },

        onMouseDown: function(e) {
            this.drawing = true;
        },

        onMouseUp: function(e) {
            this.drawing = false;
        },

        onMouseMove: function(e) {
            if (this.drawing) {
                this.onClick(e);
            }
        },

        onResize: function() {
            sandbox.trigger('domEvents.resize');
        }
    });

    return new DomEvents();
});
