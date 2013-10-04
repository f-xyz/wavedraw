define(['utils', 'modules/sandbox', 'models/wave'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = require('modules/sandbox');
    var Wave = require('models/wave');

    var World = utils.proto({
        constructor: function World() {
            this.objects = [];
            this.frame = 0;

            sandbox.on('tick', function(e) {
                e.dt = this.frame;
                this.frame++;

                this.objects = this.objects.filter(function(wave) {
                    return wave.step(e);
                });

                if (this.objects.length === 0) {
                    sandbox.trigger('stop');
                }
            }.bind(this));

            sandbox.on('click', function(e) {
                var wave = new Wave(e.x, e.y);
                this.objects.push(wave);
            }.bind(this));
        }
    });

    return new World();
});
