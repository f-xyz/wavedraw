define(['utils', 'conf', 'stats', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var preset = require('conf').preset;
    var Stats = new require('stats');

    var Viewport = utils.Class({

        constructor: function Viewport() {
            this.canvas = document.querySelector('canvas');
            this.context = this.canvas.getContext('2d');
            this.context.globalCompositeOperation = 'lighter';

            this.size = { x: null, y: null };
            this.running = false;

            sandbox.on('domEvents.resize', this.onResize.bind(this));
            sandbox.on('domEvents.toggle', this.toggle.bind(this));
            sandbox.on('domEvents.add', this.start.bind(this));
            sandbox.on('domEvents.clear', this.reset.bind(this));
            sandbox.on('world.stop', this.stop.bind(this));

            this.initStats();
            this.onResize();
        },

        initStats: function() {
            this.stats = new Stats();
            var el = this.stats.domElement;
            el.style.position = 'fixed';
            el.style.right = '10px';
            el.style.bottom = '10px';

            document.body.appendChild(el);
        },

        onResize: function() {
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight - this.canvas.offsetTop + 'px';

            this.size = {
                x: this.canvas.clientWidth,
                y: this.canvas.clientHeight
            };

            this.context.canvas.width = this.size.x;
            this.context.canvas.height = this.size.y;

            this.reset();
        },

        /////////////////////////////////////////////////////////

        start: function() {
            if (!this.running) {
                this.running = true;
                this.loop();
            }
        },

        stop: function() {
            if (this.running) {
                this.running = false;
                this.drawIndicator();
            }
        },

        toggle: function() {
            if (this.running) {
                this.stop();
            } else {
                this.start();
            }
        },

        /////////////////////////////////////////////////////////

        loop: function() {
            if (this.running) {
                requestAnimationFrame(
                    this.loop.bind(this),
                    this.canvas
                );
                this.frame();
            }
        },

        frame: function() {
            this.stats.begin();
            this.clear();
            sandbox.trigger('viewport.frame', {
                canvas: this.canvas,
                context: this.context,
                size: this.size
            });
            this.drawIndicator();
            this.stats.end();
        },

        clear: function() {
            if (preset.clearOpacity > 0) {
                // ugly chrome bug workaround
                var opacity = Math.min(preset.clearOpacity/100 + 0.15, 1);
                this.context.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
                this.context.fillRect(0, 0, this.size.x, this.size.y);
            }
        },

        reset: function() {
            this.context.clearRect(0, 0, this.size.x, this.size.y);
            this.drawIndicator();
            this.stop();
        },

        drawIndicator: function() {
            var ctx = this.context;

            ctx.beginPath();
//            ctx.arc(this.size.x-20, 20, 10, 0, 2*Math.PI, false);
            ctx.arc(this.size.x-20, this.size.y-100, 10, 0, 2*Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = ctx.strokeStyle = this.running ?
                'rgba(50, 255, 50, 1)' :
                'rgba(255, 50, 50, 1)';
            ctx.fill();
            ctx.stroke();
        }
    });

    return new Viewport();
});