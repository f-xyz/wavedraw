define(['utils'], function() {
    'use strict';

    var utils = require('utils');

    var Rgba = utils.Class({
        constructor: function Rgba(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        },
        mix: function(to, t) {
            return new Rgba(
                utils.mix(this.r, to.r, t),
                utils.mix(this.g, to.g, t),
                utils.mix(this.b, to.b, t),
                utils.mix(this.a, to.a, t)
            );
        },
        toString: function(asHex) {
            return asHex ?
                utils.sprintf('#%(r)2x%(g)2x%(b)2x', this).replace(/\s/g, '0') :
                utils.template('rgba({r},{g},{b},{a})', this);
        }
    });

    return Rgba;
});
