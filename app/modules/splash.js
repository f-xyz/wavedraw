define(['utils'], function() {
    'use strict';

    var utils = require('utils');

    function Splash() {
        this._overlay = document.getElementById('overlay');
        this._body = this._overlay.querySelector('.body');
    }

    Splash.prototype.setText = function(text) {
        this._body.innerHTML = '<h1>' + text + '</h1>';
    };

    Splash.prototype.show = function(callback) {
        this._overlay.style.display = 'block';
        this._animate(0, 0.05, callback);
    };

    Splash.prototype.hide = function() {
        this._animate(1, -0.05, function() {
            this._overlay.style.display = 'none';
        });
    };

    Splash.prototype._animate = function(opacity, delta, callback) {
        if (delta > 0 && opacity <= delta + 1
        ||  delta < 0 && opacity >= delta) {

            this._overlay.style.opacity = Math.max(0, Math.min(1, opacity));

            requestAnimationFrame(function() {
                this._animate(opacity + delta, delta, callback);
            }.bind(this), this._overlay);

        } else {
            callback && callback.call(this);
        }
    };

    return new Splash();
});