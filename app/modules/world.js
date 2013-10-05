define(['utils', 'modules/sandbox', 'models/wave'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var Wave = require('models/wave');

    var World = utils.Class({

        constructor: function World() {
            this.objects = [];

            sandbox.on('domEvents.add', this.add.bind(this));
//            sandbox.on('domEvents.back', this.add.bind(this));
            sandbox.on('viewport.frame', this.frame.bind(this));
        },

        add: function(e) {
            var wave = new Wave(e.x, e.y);
            this.objects.push(wave);
        },

        frame: function(e) {
            this.objects = this.objects.filter(function(wave) {
                wave.draw(e.context);
                wave.physics(e.size);
                return wave.isAlive();
            });

            if (this.objects.length === 0) {
//                sandbox.trigger('world.stop');
            }
        }
    });

    return new World();
});
