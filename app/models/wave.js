/**
 * Wave simulator.
 * Created by andr on 9/30/13.
 */

define(['utils', 'conf', 'modules/sandbox', 'models/rgba', 'models/processing'], function() {
    'use strict';

    var utils = require('utils');
    var preset = require('conf').preset;
    var processing = require('models/processing');
    var Rgba = require('models/rgba');

    var abssine = function(f) {
        return Math.abs(Math.sin(f / 2));
    };

    var Particle = utils.Class({
        constructor: function Particle(x, y, direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.velocity = preset.velocity;
            this.friction = preset.friction/100 + 1;
            this.rotation = preset.rotation/180*Math.PI;
        }
    });


    var Wave = utils.Class({

        constructor: function Wave(x, y) {
            this.particles = [];
            this.ttl = this.maxTtl = preset.ttl;
            this.opacity = preset.drawOpacity/100;

            var time = Date.now() / 1000;
            var r = preset.r;
            var g = preset.g;
            var b = preset.b;
            this.color = new Rgba(
                ~~utils.mix(r.range[0], r.range[1], abssine(time*r.velocity + r.phase/180*Math.PI)),
                ~~utils.mix(g.range[0], g.range[1], abssine(time*g.velocity + g.phase/180*Math.PI)),
                ~~utils.mix(b.range[0], b.range[1], abssine(time*b.velocity + b.phase/180*Math.PI)),
                this.opacity
            );

            var count = preset.count;
            for (var i = 0; i < count; i++) {
                var direction = utils.mix(0, 2*Math.PI, i/count);
                var particle = new Particle(x, y, direction);
                this.particles.push(particle);
            }
        },

        physics: function(size) {
            var t = 1 - this.ttl/this.maxTtl;

            var len = this.particles.length;
            var effects = preset.processing.effects;
            var userParams = preset.processing.params;

            for (var i = 0; i < len; i++) {
                var particle = this.particles[i];

                particle.x += particle.velocity * Math.cos(particle.direction);
                particle.y += particle.velocity * Math.sin(particle.direction);
                particle.velocity /= particle.friction;
                particle.direction += particle.rotation;

                if (preset.reflection) {
                    if (particle.x < 0) {
                        particle.x = -particle.x;
                        particle.direction = Math.PI - particle.direction;
                    }
                    if (particle.y < 0) {
                        particle.y = -particle.y;
                        particle.direction = -particle.direction;
                    }
                    if (particle.x > size.x) {
                        particle.x = 2*size.x - particle.x;
                        particle.direction = Math.PI - particle.direction;
                    }
                    if (particle.y > size.y) {
                        particle.y = 2*size.y - particle.y;
                        particle.direction = -particle.direction;
                    }
                }

                var color = this.color;
                effects.forEach(function(effectName) {
                    var effect = processing[effectName].fn;
                    var effectParams = processing[effectName].params;
                    particle = effect(
                        particle,
                        [
                            effectParams[0] * userParams[0],
                            effectParams[1] * userParams[1],
                            effectParams[2] * userParams[2]
                        ],
                        i,
                        len,
                        t,
                        size,
                        color
                    );
                });

            }

            this.color.a = utils.mix(this.opacity, 0, t);
            this.ttl -= 1;
        },

        draw: function(ctx) {
            var self = this;
            preset.renderers.forEach(function(mode) {
                self['draw' + mode](ctx);
            });
        },

        isAlive: function() {
            return this.ttl > 0;
        },

        /////////////////////////////////////////////////

        drawWebs: function(ctx) {
            ctx.beginPath();
            var len = this.particles.length;
            var last = this.particles[len - 1];
            for (var i = 0; i < len; i++) {
                var particle = this.particles[i];
                ctx.moveTo(last.x, last.y);
                ctx.lineTo(particle.x, particle.y);
                last = particle;
            }
            ctx.lineWidth = preset.particleSize;
            ctx.strokeStyle = this.color.toString();
            ctx.stroke();
        },

        drawBalls: function(ctx) {
            ctx.beginPath();
            var len = this.particles.length;
            for (var i = 0; i < len; i++) {
                var particle = this.particles[i];
                ctx.arc(particle.x, particle.y, preset.particleSize, 0, 2*Math.PI, false);
            }
            ctx.closePath();
            ctx.fillStyle = this.color.toString();
            ctx.fill();
        },

        drawLines: function(ctx) {
            ctx.beginPath();
            var len = this.particles.length;
            for (var i = 0; i < len; i++) {
                var particle = this.particles[i];
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.x+0.5, particle.y+0.5);
            }
            ctx.closePath();
            ctx.lineWidth = preset.particleSize;
            ctx.strokeStyle = this.color.toString();
            ctx.stroke();
        },

        drawStars: function(ctx) {
            ctx.beginPath();
            var len = this.particles.length;
            for (var i = 0; i < len; i++) {
                var particle = this.particles[i];
                ctx.moveTo(particle.x-0.5, particle.y-0.5);
                ctx.lineTo(particle.x+0.5, particle.y+0.5);
                ctx.moveTo(particle.x+0.5, particle.y-0.5);
                ctx.lineTo(particle.x-0.5, particle.y+0.5);
                ctx.moveTo(particle.x-0.5, particle.y);
                ctx.lineTo(particle.x+0.5, particle.y);
                ctx.moveTo(particle.x, particle.y-0.5);
                ctx.lineTo(particle.x, particle.y+0.5);
            }
            ctx.closePath();
            ctx.lineWidth = preset.particleSize;
            ctx.strokeStyle = this.color.toString();
            ctx.stroke();
        }
    });

    return Wave;
});