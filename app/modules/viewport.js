define(['conf', 'modules/sandbox'], function() {
    'use strict';

    var conf = require('conf');
    var sandbox = require('modules/sandbox');

    function Viewport() {
        this.canvas = document.getElementById('viewport');
        this.context = this.canvas.getContext('2d');
        this.context.globalCompositeOperation = 'lighter';

        this.size = { x: null, y: null };
        this.running = false;

        sandbox.on('domEvents.resize', this.onResize.bind(this));
        sandbox.on('domEvents.add', this.start.bind(this));
        sandbox.on('world.stop', function() {
            conf.preset.persistence ? this.stop() : this.reset();
        }.bind(this));
        sandbox.on('viewport.toggle', this.toggle.bind(this));
        sandbox.on('viewport.reset', this.reset.bind(this));
        sandbox.on('viewport.fullScreen', this.fullScreen.bind(this));

        this.onResize(true);
    }

    Viewport.prototype.initFpsCounter = function() {
        this.fps = 0;
        this.lastFpsCalcTime = null;
        this.framesProcessed = 0;
    };

    Viewport.prototype.onResize = function(initPhase) {
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight - this.canvas.offsetTop + 'px';

        this.size = {
            x: this.canvas.clientWidth,
            y: this.canvas.clientHeight
        };

        if (!initPhase) {
            var buffer = new Image();
            buffer.src = this.canvas.toDataURL();
        }

        // resizing clears canvas
        this.context.canvas.width = this.size.x;
        this.context.canvas.height = this.size.y;

        if (!initPhase) {
            this.context.fillStyle = 'black';
            this.context.fillRect(0, 0, this.size.x, this.size.y);
            this.context.drawImage(
                buffer,
                0, 0, buffer.width, buffer.height
            );
        }
    };

    /////////////////////////////////////////////////////////

    Viewport.prototype.start = function() {
        if (!this.running) {
            this.running = true;
            this.initFpsCounter();
            this.loop();
            sandbox.trigger('viewport.start');
        }
    };

    Viewport.prototype.stop = function() {
        if (this.running) {
            this.running = false;
            sandbox.trigger('viewport.stop');

            this.initFpsCounter();
            sandbox.trigger('viewport.fpsMeasured', this.fps);
        }
    };

    Viewport.prototype.toggle = function() {
        if (this.running) {
            this.stop();
        } else {
            this.start();
        }
    };

    /////////////////////////////////////////////////////////

    Viewport.prototype.loop = function() {
        if (this.running) {
            requestAnimationFrame(
                this.loop.bind(this),
                this.canvas
            );
            this.frame();
        }
    };

    Viewport.prototype.frame = function() {
        this.clear();

        sandbox.trigger('viewport.frame', {
            canvas: this.canvas,
            context: this.context,
            size: this.size
        });

        this.framesProcessed++;

        var time = Date.now();
        var dt = time - this.lastFpsCalcTime;
        if (dt >= 1000) {
            this.fps = Math.round(this.framesProcessed / dt * 1000);
            this.lastFpsCalcTime = time;
            this.framesProcessed = 0;
            sandbox.trigger('viewport.fpsMeasured', this.fps);
        }
    };

    Viewport.prototype.clear = function() {
        if (!conf.preset.persistence) {
            this.context.fillStyle = 'rgba(0, 0, 0, 0.15)';
            this.context.fillRect(0, 0, this.size.x, this.size.y);
        }
    };

    Viewport.prototype.reset = function() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.size.x, this.size.y);
        this.stop();
    };

    Viewport.prototype.fullScreen = function() {
        // OMG :E
        if (!document.fullscreenElement
        &&  !document.webkitFullscreenElement
        &&  !document.mozFullScreenElement
        ) {
            var element = document.documentElement;
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen()
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }

        this.onResize();
    };

    return new Viewport();
});