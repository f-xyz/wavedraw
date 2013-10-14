define(['utils', 'conf', 'modules/sandbox'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var sandbox = require('modules/sandbox');

    var Popup = utils.Class({
        costructor: function Popup() {
            sandbox.on('opup');
        }
    });

    return new Popup();

});