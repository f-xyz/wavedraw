define(['utils', 'stats', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var stats = new require('stats');

    var Viewport = new utils.proto({
        constructor: function Viewport() {},

        initialize: function(canvas) {

            this._canvas = canvas;
            this._context = canvas.getContext('2d');

            this._size = {
                x: canvas.clientWidth,
                y: canvas.clientHeight
            };

            this._context.canvas.width = this._size.x;
            this._context.canvas.height = this._size.y;

            this._running = false;

            this._drawIndicator();

            document.addEventListener('keypress', function(e) {
                if (e.keyCode === 32) {
                    this.toggle();
                } else if (e.keyCode === 13) {
                    this._tick();
                }
            }.bind(this));

            canvas.addEventListener('click', function(e) {
                sandbox.trigger('click', {
                    x: e.clientX,
                    y: e.clientY
                });
//                this.start();
            }.bind(this));

            sandbox.on('stop', this.stop.bind(this));
        },

        start: function() {
            this._running = true;
            if (window.cancelAnimationFrame) {
                window.cancelAnimationFrame(this._af);
            }
            var tick = this._tick.bind(this);
            requestAnimationFrame(tick, this._canvas);
        },

        stop: function() {
            this._running = false;
            this._drawIndicator();
        },

        toggle: function() {
            if (this._running) {
                this.stop();
            } else {
                this.start();
            }
        },

        _tick: function() {
            if (!this._running) {
                return;
            }

            var tick = this._tick.bind(this);
            this._af = requestAnimationFrame(tick, this._canvas);

            this._context.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this._context.fillRect(0, 0, this._size.x, this._size.y);

            this._drawIndicator();

            sandbox.trigger('tick', {
                context: this._context,
                size: this._size
            });
        },

        _drawIndicator: function() {
            var ctx = this._context;

            ctx.beginPath();
            ctx.arc(this._size.x-20, 20, 10, 0, 2*Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = this._running ?
                'rgba(50, 255, 50, 1)' :
                'rgba(255, 50, 50, 1)';
            ctx.strokeStyle = 'black';
            ctx.fill();
            ctx.stroke();
        }
    });

    return new Viewport();
});