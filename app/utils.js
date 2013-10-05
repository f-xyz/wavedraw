define(['sprintf'], function() {
    'use strict';

    var utils = {};

    /**
     * @param {object} map
     * @param {object} [map.extends]
     * @param {object} [map.mixin]
     * @returns {function}
     */
    utils.Class = function(map) {
        var key;
        var constructor = map.constructor || function() {};
        var prototype = map.extends ?
                        Object.create(map.extends.prototype) :
                        {};

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

//        console.log(constructor.prototype === prototype);
//        console.log(prototype.constructor === constructor);

        constructor.prototype = prototype;
        prototype.constructor = constructor;

//        console.log(constructor.prototype === prototype);
//        console.log(prototype.constructor === constructor);
//        console.log('-------------------------------');

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
        var result = string.replace(/\{\w+\}/g, function(match) {
            var key = match.substr(1, match.length - 2);
            return key in map ? map[key] : map[i++];
        });
        return result;
    };

    /**
     * Может еще и такое:
     * var users = [
     *  {name: 'Dolly'},
     *  {name: 'Molly'},
     *  {name: 'Polly'}
     * ];
     * sprintf('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', {users: users});
     * // Hello Dolly, Molly and Polly
     * @type {function}
     */
    utils.sprintf = require('sprintf');

    /**
     *
     * @returns {Array}
     */
    utils.callStack = function() {
        try {
            new Error('###');
            return [];
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
        },
        on: function(event, fn) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(fn);
        },
        off: function(event, fn) {
            if (this.events[event]) {
                if (fn) {
                    var index = this.events[event].indexOf(fn);
                    this.events[event].splice(index, 1);
                } else {
                    this.events[event] = [];
                }
            }
        },
        trigger: function(event, data) {
            if (this.events[event]) {
                var subscribers = this.events[event];
                data = data || {};
                data.__event = event;
                for (var i in subscribers) {
                    subscribers[i].call(this, data);
                }
            }
        },
        debug: function(fn) {
            for (var event in this.events) {
                this.events[event].push(fn);
            }
        }
    });

    return utils;
});
