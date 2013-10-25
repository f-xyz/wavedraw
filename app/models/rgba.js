define(['utils'], function() {
    'use strict';

    var utils = require('utils');

    function RGBA(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    RGBA.FORMAT_HEX = 'hex';
    RGBA.FORMAT_RGBA = 'rgba';

    RGBA.prototype.mix = function(to, t) {
        return new RGBA(
            Math.floor(utils.mix(this.r, to.r, t)),
            Math.floor(utils.mix(this.g, to.g, t)),
            Math.floor(utils.mix(this.b, to.b, t)),
            utils.mix(this.a, to.a, t)
        );
    };

    RGBA.prototype.toString = function(format) {
        if (format === RGBA.FORMAT_HEX) {
            return utils.sprintf('#%(r)2x%(g)2x%(b)2x', this).replace(/\s/g, '0');
        } else { // RGBA.FORMAT_RGBA
            return utils.template('rgba({r},{g},{b},{a})', this);
        }
    };

    return RGBA;
});
