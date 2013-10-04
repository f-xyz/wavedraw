define(function() {
    'use strict';

    var utils = {};

    /**
     * @param {object} map
     * @param {object} [map.extends]
     * @param {object} [map.mixin]
     * @returns {function}
     */
    utils.proto = function(map) {
        var constructor = map.constructor || function() {};
        var prototype = map.extends ?
                        Object.create(map.extends.prototype) :
                        {};
        var key;

        for (key in map) {
            if (map.hasOwnProperty(key)) {
                prototype[key] = map[key];
            }
        }

        if (map.mixin) {
            for (key in map.mixin) {
                if (map.mixin.hasOwnProperty(key)) {
                    prototype[key] = map.mixin[key];
                }
            }
        }

        constructor.prototype = prototype;
        prototype.constructor = constructor;

        return constructor;
    };

    /**
     * abc{0}de{2}f + ['@', '#] => 'abc@de#f'
     * abc{fst}de{snd}f + { fst: '@' } => 'abc@de{snd}f'
     * @param {string} string
     * @param {object} map
     * @returns {string}
     */
    utils.template = function(string, map) {
        var i = 0;
        var result = string.replace(/\{\w+\}/g, function(match) {
            var key = match.substr(1, match.length - 2);
            return key in map ? map[key] : map[i++];
        });
        return result;
    };

    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    utils.randomEx = function(min, max) {
        return min + (max - min) * Math.random();
    };

    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    utils.randomInt = function(min, max) {
        return ~~(utils.randomEx(min, max+1));
    };

    /**
     * Linear interpolation.
     * @param {number} min
     * @param {number} max
     * @param {number} t [0..1]
     * @returns {number}
     */
    utils.mix = function(min, max, t) {
        return min + (max - min) * t;
    };

    /**
     * @type {Function}
     * @class {EventEmitter}
     */
    utils.EventEmitter = utils.proto({
        constructor: function EventEmitter() {
            this._events = {};
        },
        on: function(event, fn) {
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(fn);
        },
        onAny: function(fn) {
            for (var event in this._events) {
                this._events[event].push(fn);
            }
        },
        off: function(event, fn) {
            if (this._events[event]) {
                if (fn) {
                    var index = this._events[event].indexOf(fn);
                    this._events[event].splice(index, 1);
                } else {
                    this._events[event] = [];
                }
            }
        },
        clear: function(event) {
            if (event) {
                if (event in this._events) {
                    delete this._events[event];
                }
            } else {
                this._events = {};
            }
        },
        trigger: function(event, data) {
            if (this._events[event]) {
                var subscribers = this._events[event];
                data = data || {};
                data.__event = event;
                for (var i in subscribers) {
                    subscribers[i].call(this, data);
                }
            }
        }
    });

    return utils;
});
