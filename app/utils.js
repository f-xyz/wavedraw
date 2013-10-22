define(['sprintf'], function() {
    'use strict';

    var utils = {};

    /**
     *
     * @param src
     * @param dst
     */
    utils.clone = function(src, dst) {
        dst = dst || {};
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                var val = src[key];
                if (typeof(val) === 'object') {
                    utils.clone(val, dst[key] || {});
                } else {
                    dst[key] = val;
                }
            }
        }
        return dst;
    };

     window.o = {
         'null': null,
         'undefined': undefined,
         'number': 123,
         'string': 'abc',
         'array': [1,{z:2},3],
         'object': {
             a: 1,
             b: 2,
             c: 3,
             'subarray': [3,2,1],
             'subobject': { q:1, w:2, e:3 }
         },
         'date': new Date(Date.now()),
         'func': function() {}
     };
     window.o2 = utils.clone(window.o);

    (function cloneTest(src, dst) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                var val = src[key];
                if (typeof(val) === 'object' && val === dst[key]) {
                    return true;
                }
            }
        }
        return false;
    })(window.o, window.o2);

    /**
     * @param {object} map
     * @param {object} [map.extends]
     * @param {object} [map.mixin]
     * @returns {function}
     */
    utils.Class = function(map) {
        var key;
        var constructor = map.constructor || function() {};
        var prototype = map.extends ? Object.create(map.extends.prototype) : {};

        for (key in map) {
            if (map.hasOwnProperty(key)) {
                prototype[key] = map[key];
            }
        }

        constructor.prototype = prototype;

        return constructor;
    };

    /**
     * abc{0}de{1}f + ['@', '#] => 'abc@de#f'
     * abc{fst}de{snd}f + { fst: '@' } => 'abc@de{snd}f'
     * @param {string} string
     * @param {object} map
     * @returns {string}
     */
    utils.template = function(string, map) {
        var i = 0;
        return string.replace(/\{\w+\}/g, function(match) {
            var key = match.substr(1, match.length - 2);
            return key in map ? map[key] : map[i++];
        });
    };

    /**
     * sprintf("%s %.2f %u", ...);
     * var users = [ {name: '000'}, {name: '111'}, {name: '222'} ];
     * sprintf('%(users[0].name), %(users[1].name) and %(users[2].name)', {users: users});
     * @type {function}
     */
    utils.sprintf = require('sprintf');

    /**
     * @returns {Array}
     */
    utils.callStack = function() {
        try {
            new Error('###');
        } catch (e) {
            return e.stack.replace(/[ ]{2,}/g, '').split(/\n/).slice(1);
        }
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
     *
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    utils.limit = function(value, min, max) {
        return Math.max(min, Math.min(max, value));
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
    utils.EventEmitter = utils.Class({
        constructor: function EventEmitter() {
            this.events = {};
            this.allCallbacks = [];
        },

        on: function(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        },

        once: function(event, callback) {
            var onceCallback = function() {
                callback.apply(this, arguments);
                this.off(event, onceCallback);
            };
            this.on(event, onceCallback);
        },

        onMap: function(map) {
            for (var event in map) {
                if (map.hasOwnProperty(event)) {
                    this.on(event, map[event]);
                }
            }
        },

        off: function(event, callback) {
            if (this.events[event]) {
                if (callback) {
                    var index = this.events[event].indexOf(callback);
                    this.events[event].splice(index, 1);
                } else {
                    delete this.events[event];
                }
            }
        },

        trigger: function(event/*, data*/) {
            var i;
            var args;
            var subscribers = this.events[event];
            var debugCallbacks = this.allCallbacks;

            for (i in debugCallbacks) {
                if (debugCallbacks.hasOwnProperty(i)) {
                    debugCallbacks[i].apply(this, arguments);
                }
            }

            if (subscribers) {
                args = Array.prototype.slice.call(arguments, 1);
                for (i in subscribers) {
                    if (subscribers.hasOwnProperty(i)
                    &&  subscribers[i].apply(this, args) === false) {
                        break;
                    }
                }
            }
        },

        onAll: function(callback) {
            this.allCallbacks.push(callback);
        }
    });

    return utils;
});
