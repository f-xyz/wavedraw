define(['utils', 'conf', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var sandbox = require('modules/sandbox');

    var Popup = utils.Class({
        constructor: function Popup() {
            console.log('constructor', event, []);
        },
        initialize: function() {
            console.log('initialize', event, []);
        }
    });

//    return new Popup();
    return {
        constructor: function Popup() {
            console.log('constructor', event, []);
        },
        initialize: function() {
            console.log('initialize', event, []);
        }
    };
});