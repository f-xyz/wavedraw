define(function() {
    'use strict';

    return {
        debug: 1,

        preset: {

            clearOpacity: 1,
            drawOpacity: 100,
            particleSize: 1,

            renderers: ['Webs'],
            reflection: true,
            eraser: false, // doesn't have a control yet

            delay: 100,
            count: 360,
            ttl: 100,
            velocity: 1,
            rotation: 0,
            friction: 0,

            processing: {
                effects: [],
                params: [1, 1, 1]
            },

            r: {
                range: [0, 255],
                velocity: 1,
                phase: 0
            },
            g: {
                range: [0, 255],
                velocity: 0.3,
                phase: 90
            },
            b: {
                range: [0, 255],
                velocity: 0.25,
                phase: -90
            }
        }
    };
});