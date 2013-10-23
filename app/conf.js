define(['utils', 'text!/../db/presets.json'], function() {

    var utils = require('utils');
    var presets = require('text!/../db/presets.json');
    presets = JSON.parse(presets);

    return {
        debug: 1,
        renderers: [ 'Lines', 'Dots', 'Stars' ],
        presets: presets,
        preset: utils.clone(presets['Default']) // current preset
    };
});