define(['utils', 'conf', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var sandbox = require('modules/sandbox');

    var Popup = utils.Class({
        constructor: function Popup() {
            console.log('constructor');
        },
        initialize: function() {
            console.log('initialize');
        }
    });

//    return new Popup();
    return {
        constructor: function Popup() {
            console.log('constructor');
        },
        initialize: function() {
            console.log('initialize');
        }
    };
});