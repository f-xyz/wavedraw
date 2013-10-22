define(['text!/../db/presets.json'], function() {

    var presets = require('text!/../db/presets.json');
    presets = JSON.parse(presets);

    return {
        debug: 1,
        renderers: [ 'Lines', 'Dots', 'Stars' ],
        presets: presets,
        preset: presets['Default'] // current preset
    };
});