define(['utils', 'modules/sandbox', 'modules/viewport', 'modules/world'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var viewport = require('modules/viewport');
    var world = require('modules/world');

    var DomEvents = utils.Class({

        constructor: function DomEvents() {
            document.addEventListener('keydown', this.onKeypress.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));

            this.drawing = false;
            viewport.canvas.addEventListener('click', this.onClick.bind(this));
            viewport.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
            viewport.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
            viewport.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
            viewport.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
        },

        onKeypress: function(e) {
            if (e.keyCode === 32 && e.ctrlKey && world.objects.length) { // space
                e.preventDefault();
                sandbox.trigger('viewport.toggle');
            } else if (e.keyCode === 90 && e.ctrlKey) { // z
                e.preventDefault();
                sandbox.trigger('viewport.reset');
            } else if (e.keyCode === 67 && e.ctrlKey && !e.shiftKey) { // c
                e.preventDefault();
                sandbox.trigger('ui.toggleControlPanel');
            } else if (e.keyCode === 71 && e.ctrlKey) { // g
                e.preventDefault();
                sandbox.trigger('ui.toggleGallery');
            }
        },

        onClick: function(e) {
            sandbox.trigger('domEvents.add', {
                x: e.clientX - e.target.offsetLeft,
                y: e.clientY - e.target.offsetTop
            });
        },

        onMouseDown: function() {
            this.drawing = true;
        },

        onMouseUp: function() {
            this.drawing = false;
        },

        onMouseMove: function(e) {
            if (this.drawing) {
                this.onClick(e);
            }
        },

        onMouseOut: function() {
            this.drawing = false;
        },

        onResize: function() {
            sandbox.trigger('domEvents.resize');
        }
    });

    return new DomEvents();
});
