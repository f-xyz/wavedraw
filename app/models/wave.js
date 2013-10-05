/**
 * Wave simulator.
 * Created by andr on 9/30/13.
 */

define(['utils', 'conf', 'modules/sandbox', 'models/rgba'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var Rgba = require('models/rgba');

    var Particle = utils.Class({

        constructor: function Particle(x, y, direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
        },

        physics: function(size, velocity) {
            this.x += velocity * Math.cos(this.direction);
            this.y += velocity * Math.sin(this.direction);

            if (this.x < 0) {
                this.x = -this.x;
                this.direction = Math.PI - this.direction;
            }

            if (this.y < 0) {
                this.y = -this.y;
                this.direction = -this.direction;
            }

            if (this.x > size.x) {
                this.x = 2*size.x - this.x;
                this.direction = Math.PI - this.direction;
            }

            if (this.y > size.y) {
                this.y = 2*size.y - this.y;
                this.direction = -this.direction;
            }
        }
    });


    var Wave = utils.Class({

        constructor: function Wave(x, y) {
            this.particles = [];
            this.ttl = this.maxTtl = 100;
            this.velocity = this.maxVelocity = 2;

            var time = Date.now();
            var mod = function(f) { return Math.abs(Math.sin(f) / 2); };
            this.color = new Rgba(
                ~~utils.mix(0,   255, mod(time/1000)),
                ~~utils.mix(0,   100, mod(time/1000/3 + Math.PI/2)),
                ~~utils.mix(127, 255, mod(time/1000/4 - Math.PI/2)),
                (this.maxOpacity = 0.6)
            );

            var count = 36;
            for (var i = 0; i < count; i++) {
                var direction = utils.mix(0, 2*Math.PI, (i+1)/count);
                var particle = new Particle(x, y, direction);
                this.particles.push(particle);
                console.log(i, (i+1)/count, direction);
            }
        },

        draw: function(ctx) {
            ctx.beginPath();
            var len = this.particles.length;
            var last = this.particles[len - 1];
            this.particles.forEach(function(particle) {
                ctx.moveTo(last.x, last.y);
                ctx.lineTo(particle.x, particle.y);
                last = particle;
            });
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.color.toString();
            ctx.stroke();
        },

        physics: function(size) {
            this.ttl -= 0.5;
            var t = 1 - this.ttl/this.maxTtl;

            this.velocity = utils.mix(this.maxVelocity, 0, 2*Math.pow(t, 1/10));
            this.color.a = utils.mix(this.maxOpacity, 0, t);

            this.particles.forEach(function(particle, i) {
//                particle.direction += Math.sin(Date.now());
//                particle.direction += i % 2 ?
//                    utils.mix(0, Math.PI, 0.5*Math.sin(Date.now())) :
//                    utils.mix(0, Math.PI, 0.1*Math.cos(Date.now()));
                particle.physics(size, this.velocity);
            }.bind(this));
        },

        isAlive: function() {
            return this.ttl > 0;
        }

    });

    return Wave;
});