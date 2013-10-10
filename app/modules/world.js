define(['utils', 'conf', 'modules/sandbox', 'models/wave'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var preset = require('conf').preset;
    var Wave = require('models/wave');

    var World = utils.Class({

        constructor: function World() {
            this.objects = [];

            sandbox.on('domEvents.add', this.add.bind(this));
            sandbox.on('domEvents.clear', this.clear.bind(this));
            sandbox.on('viewport.frame', this.frame.bind(this));
        },

        add: function(e) {
            if (!this.lastAddTime || Date.now() - this.lastAddTime > preset.delay) {
                this.objects.push(new Wave(e.x, e.y));
                this.lastAddTime = Date.now();
            }
        },

        clear: function() {
            this.objects = [];
        },

        frame: function(e) {
            var len = this.objects.length;

            this.objects = this.objects.filter(function(wave) {
                wave.draw(e.context);
                wave.physics(e.size);
                return wave.isAlive();
            });

            if (len > 0 && this.objects.length === 0) {
                sandbox.trigger('world.stop');
            }

            this.drawInfo(e.context, e.size);
        },

        drawInfo: function(ctx, size) {
            var particles = 0;
            for (var i = 0, len = this.objects.length; i < len; i++) {
                particles += this.objects[i].particles.length;
            }

            var text = particles + ' particles';
            var tm = ctx.measureText(text);

            ctx.clearRect(size.x - 90, size.y - 80, 100, 15);

            ctx.fillStyle = 'rgb(0, 229, 229)';
            ctx.fillText(text, size.x - 10 - tm.width, size.y - 70);
        }
    });

    return new World();
});
