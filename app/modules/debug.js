define(
    ['utils', 'conf', 'stats', 'jQuery', 'angular',
    'modules/sandbox', 'modules/viewport', 'modules/domEvents', 'modules/world', 'modules/presets'],
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
            window.presets = require('modules/presets');
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