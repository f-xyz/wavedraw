/**
 * Wave simulator.
 * Created by andr on 9/30/13.
 */

define(['utils', 'conf', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
//    var conf = require('conf');

    var Particle = utils.proto({
        constructor: function Particle(x, y, direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.radius = 3;
        },

        step: function(size, velocity, dt) {
            this.x += dt * velocity * Math.cos(this.direction);
            this.y += dt * velocity * Math.sin(this.direction);

            if (this.x < 0) {
                this.x = -this.x;
                this.direction = Math.PI - this.direction;
            }

            if (this.x > size.x) {
                this.x = 2*size.x - this.x;
                this.direction = Math.PI - this.direction;
            }

            if (this.y < 0) {
                this.y = -this.y;
                this.direction = -this.direction;
            }

            if (this.y > size.y) {
                this.y = 2*size.y - this.y;
                this.direction = -this.direction;
            }
        },

        draw: function(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 10, 255, 1)';
            ctx.fill();
        }
    });

    var Wave = utils.proto({
        constructor: function Wave(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];

            this.startVelocity = 10;
            this.velocity = this.startVelocity;
            this.opacity = 1;

            var direction,
                precision = 100,
                particle,
                step = 2*Math.PI/precision;
            for (direction = 0; direction < 2*Math.PI; direction += step) {
                particle = new Particle(x, y, direction);
                this.particles.push(particle);
            }
        },

        step: function(e) {
            var ctx = e.context;
            var len = this.particles.length;
            var prev = this.particles[len-1];
            ctx.beginPath();
            this.particles.forEach(function(particle) {
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(particle.x, particle.y);
                prev = particle;
                particle.step(e.size, this.velocity, e.dt / 1e3);
            }.bind(this));
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = utils.template('rgba(255, 10, 255, {opacity})', { opacity: this.opacity });
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fill();
            ctx.stroke();

            this.opacity = this.velocity / this.startVelocity;
            this.velocity -= 0.01;

            return this.velocity > 0;
        }

    });

    return Wave;
});