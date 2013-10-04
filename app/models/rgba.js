define(['utils'], function() {
    'use strict';

    var utils = require('utils');

    var Rgba = utils.proto({
        constructor: function Rgba(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        },
        toString: function() {
            return 'rgba(' 
                + this.r + ', '
                + this.g + ', ' 
                + this.b + ', '
                +this.a + ')';
        }
    });

    return Rgba;
});
