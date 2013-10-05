require.config({
    baseUrl: 'app',
    paths: {
        stats:      '../lib/stats.js/build/stats.min',
        angular:    '../lib/angular/angular.min',
        domReady:   '../lib/requirejs-domready/domReady',
        sprintf:    '../lib/sprintf/src/sprintf'
    },
    shim: {
        stats: { exports: 'Stats' },
        sprintf: { exports: 'sprintf' }
    },
    urlArgs: Date.now()
});

require(
    ['utils', 'conf', 'stats', 'angular', 'domReady',
     'modules/sandbox', 'modules/viewport', 'modules/domEvents', 'modules/world'],
    function() {
        'use strict';

        var conf = require('conf');
        if (conf.debug > 0) {
            window.conf = require('conf');
            window.utils = require('utils');
            window.sandbox = require('modules/sandbox');
            window.viewport = require('modules/viewport');
            window.domEvents = require('modules/domEvents');
            window.world = require('modules/world');
        }
        if (conf.debug > 1) {
            var sandbox = require('modules/sandbox');
            sandbox.debug(function(e) {
                if (e.__event !== 'viewport.frame' || conf.debug > 2) {
                    console.log(e);
                }
            });
        }
    }
);