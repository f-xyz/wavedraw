require.config({
    baseUrl: 'app',
    paths: {
        jquery:         '../lib/jquery/jquery.min',
        stats:          '../lib/stats.js/build/stats.min',
        es5shim:        '../lib/es5-shim/es5-shim.min',
        es5sham:        '../lib/es5-shim/es5-sham.min',
        angular:        '../lib/angular/angular.min'
    },
    shim: {
        jquery:       { exports: '$' },
        stats:        { exports: 'Stats' }
    },
//    packages: ['ge'],
    urlArgs: Date.now()
});

require(
    ['utils', 'es5shim', 'es5sham', 'stats', 'angular',
     'modules/sandbox', 'modules/viewport', 'modules/world'],
    function() {
        'use strict';

        var canvas = document.querySelector('canvas');
        var viewport = require('modules/viewport');
        viewport.initialize(canvas);

        var sandbox = require('modules/sandbox');
        sandbox.onAny(function(e) {
            if (e.__event !== 'tick') {
                console.log(e);
            }
        });
    }
);