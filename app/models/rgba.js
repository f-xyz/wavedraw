define(['utils'], function() {
    'use strict';

    var utils = require('utils');

    var Rgba = utils.proto({
        constructor: function Rgba(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    });

    return Rgba;
});