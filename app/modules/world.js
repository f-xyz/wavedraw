define(['conf', 'modules/sandbox', 'models/wave'], function() {
    'use strict';

    var conf = require('conf');
    var sandbox = require('modules/sandbox');
    var Wave = require('models/wave');

    function World() {
        this.objects = [];
        this.prevParticlesCount = 0;

        sandbox.on('domEvents.add', this.add.bind(this));
        sandbox.on('viewport.frame', this.frame.bind(this));
        sandbox.on('viewport.reset', this.reset.bind(this));
    }

    World.prototype.add = function(e) {
        if (!this.lastAddTime || Date.now() - this.lastAddTime > conf.preset.delay) {
            this.objects.push(new Wave(e.x, e.y));
            this.lastAddTime = Date.now();
        }
    };

    World.prototype.frame = function(e) {
        var len = this.objects.length;
        var particles = 0;

        this.objects = this.objects.filter(function(wave) {
            wave.draw(e.context);
            wave.physics(e.size);
            var isAlive = wave.isAlive();
            if (isAlive) {
                particles += wave.particles.length;
            }
            return isAlive;
        });

        if (len > 0 && this.objects.length === 0) {
            sandbox.trigger('world.stop');
        }

        if (this.prevParticlesCount != particles) {
            sandbox.trigger('world.particlesChanged', particles);
            this.prevParticlesCount = particles;
        }
    };

    World.prototype.reset = function() {
        this.objects = [];
        this.prevParticlesCount = 0;
        sandbox.trigger('world.particlesChanged', 0);
    };

    return new World();
});
