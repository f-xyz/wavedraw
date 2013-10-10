define([], function() {
    return {
        'Test': {
            fn: function(particle, params/*, i, len, t, size, color*/) {
                particle.x += (params[0] - 1) * Math.sin(particle.y);
                particle.y += (params[0] - 1) * Math.cos(particle.x);
                particle.direction += (params[1] - 1) * Math.sin(particle.x);
                particle.direction += (params[2] - 1) * Math.sin(particle.y);
                return particle;
            },
            params: [1, 1, 1]
        },
        'Rainbow?': {
            fn: function(particle, params, i, len, t, size, color) {
                color.r = Math.floor(255 * Math.abs(Math.sin(t/(params[0]+0.1))));
                color.g = Math.floor(255 * Math.abs(Math.sin(t/(params[1]+0.1)+Math.PI/2)));
                color.b = Math.floor(255 * Math.abs(Math.sin(t/(params[2]+0.1)-Math.PI/2)));
                return particle;
            },
            params: [1, 1, 1]
        },
        'Flower': {
            fn: function(particle, params, i/*, len, t, size, color*/) {
                particle.x += Math.sin(i / params[0]);
                particle.y += Math.cos(i / params[1]);
                return particle;
            },
            params: [10, 10, 1]
        },
        'Spline': {
            fn: function(particle, params/*, i, len, t, size, color*/) {
                particle.x += Math.sin(particle.y / params[0]);
                particle.y += Math.cos(particle.x / params[1]);
                return particle;
            },
            params: [30, 70, 1]
        },
        'Ball': {
            fn: function(particle, params/*, i, len, t, size, color*/) {
                particle.direction += Math.sin(Date.now() / params[0]);
                particle.direction += Math.cos(Date.now() / params[1]);
                return particle;
            },
            params: [300, 700, 1]
        },
        'Swirl': {
            fn: function(particle, params, i, len, t/*, size, color*/) {
                particle.direction += Math.sin(t / params[0]);
                particle.direction += Math.sin(i / params[1]);
                return particle;
            },
            params: [10, 10, 1]
        }
    };
});