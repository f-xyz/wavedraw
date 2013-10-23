define(
    ['utils', 'conf',
    'modules/sandbox', 'modules/viewport', 'modules/domEvents',
    'modules/world', 'modules/popup', 'services/backend'],
    function() {
        'use strict';

        window.console = console || {
            log: function() {},
            dir: function() {}
        };

        var conf = require('conf');
        if (conf.debug >= 1) {

            console.log('debug enabled!');

            window.utils = require('utils');
            window.conf = require('conf');
            window.sandbox = require('modules/sandbox');
            window.viewport = require('modules/viewport');
            window.domEvents = require('modules/domEvents');
            window.world = require('modules/world');
            window.backend = require('services/backend');
            window.popup = require('modules/popup');

            var sandbox = require('modules/sandbox');
            sandbox.onAll(function(event) {
                if (conf.debug >= 2) {
                    console.log('*', event, Array.prototype.slice.call(arguments, 1));
                }
            });
        }
    }
);