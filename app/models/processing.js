define([], function() {
    return {
        'Weird': {
            fn: function(particle, params) {
                particle.x += (params[0]) * Math.sin(particle.y);
                particle.y += (params[0]) * Math.cos(particle.x);
                particle.direction += (params[1]) * Math.sin(particle.x);
                particle.direction += (params[2]) * Math.cos(particle.y);
                return particle;
            },
            params: [1, 1, 1]
        },
        'Rainbow': {
            fn: function(particle, params, i, len, t, size, color) {
                t = Date.now() / 1000;
                color.r = Math.floor(255 * Math.abs(Math.sin(t/(params[0]))));
                color.g = Math.floor(255 * Math.abs(Math.sin(t/(params[1])+Math.PI/2)));
                color.b = Math.floor(255 * Math.abs(Math.sin(t/(params[2])-Math.PI/2)));
                return particle;
            },
            params: [1, 0.3, 0.25]
        },
        'Flower': {
            fn: function(particle, params, i) {
                particle.x += Math.sin(i / params[0]);
                particle.y += Math.cos(i / params[1]);
                return particle;
            },
            params: [1, 1, 1]
        },
        'Spline': {
            fn: function(particle, params) {
                particle.x += Math.sin(particle.y / params[0]);
                particle.y += Math.cos(particle.x / params[1]);
                return particle;
            },
            params: [30, 70, 1]
        },
        'Pulsation': {
            fn: function(particle, params) {
                particle.direction += Math.sin(Date.now() / params[0]);
                particle.direction += Math.cos(Date.now() / params[1]);
                return particle;
            },
            params: [300, 700, 1]
        },
        'Swirl': {
            fn: function(particle, params, i, len, t) {
                particle.direction += Math.sin(t / params[0]);
                particle.direction += Math.sin(i / params[1]);
                return particle;
            },
            params: [10, 10, 1]
        }
    };
});