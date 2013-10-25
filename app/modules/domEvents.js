define(['modules/sandbox', 'modules/viewport', 'modules/world'], function() {
    'use strict';

    var sandbox = require('modules/sandbox');
    var viewport = require('modules/viewport');
    var world = require('modules/world');

    function DomEvents() {
        window.addEventListener('keydown', this.onKeypress.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));

        this.drawing = false;
        viewport.canvas.addEventListener('click', this.onClick.bind(this));
        viewport.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        viewport.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        viewport.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        viewport.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
    }

    DomEvents.prototype.onKeypress = function(e) {
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
        } else if (e.keyCode === 83 && e.ctrlKey) { // s
            e.preventDefault();
            sandbox.trigger('ui.download');
        }
    };

    DomEvents.prototype.onClick = function(e) {
        sandbox.trigger('domEvents.add', {
            x: e.clientX - e.target.offsetLeft,
            y: e.clientY - e.target.offsetTop
        });
    };

    DomEvents.prototype.onMouseDown = function() {
        this.drawing = true;
    };

    DomEvents.prototype.onMouseUp = function() {
        this.drawing = false;
    };

    DomEvents.prototype.onMouseMove = function(e) {
        if (this.drawing) {
            this.onClick(e);
        }
    };

    DomEvents.prototype.onMouseOut = function() {
        this.drawing = false;
    };

    DomEvents.prototype.onResize = function() {
        sandbox.trigger('domEvents.resize');
    };

    return new DomEvents();
});
