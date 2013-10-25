define(['utils', 'text!/presets/list'], function() {

    var utils = require('utils');
    var presets = require('text!/presets/list');
    presets = JSON.parse(presets);

    return {
        debug: 0,
        renderers: [ 'Lines', 'Dots', 'Stars' ],
        presets: presets,
        preset: utils.clone(presets['Default']) // current preset
    };
});