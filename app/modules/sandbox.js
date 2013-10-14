define(['utils'], function() {
    'use strict';

    var utils = require('utils');
    var sandbox = new utils.EventEmitter();

    window.sandbox = sandbox;

    return sandbox;
});