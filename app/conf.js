define(function() {
    'use strict';

    return {

        debug: 1,
        renderers: [ 'Lines', 'Dots', 'Stars' ],
        defaultPreset: 'Default',

        preset: {

            authorName: null,
            creationDate: null,
            rating: null,
            ratingCount: 0,
            preview: null,

            delay: 100,
            drawOpacity: 100,
            persistence: true,

            renderers: ['Lines'],
            reflection: true,

            count: 36,
            ttl: 100,
            velocity: 1,
            rotation: 0,
            friction: 0,
            particleSize: 1,

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