define(['utils', 'conf'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var Presets = utils.Class({
        constructor: function Presets() {
            this.localStorageKey = 'presets';
            this.presets = null;
            this.load();
        },
        load: function() {
            try {
                var json = localStorage.getItem(this.localStorageKey);
                this.presets = JSON.parse(json);
                if (!this.presets) {
                    throw new Error('No presets!');
                }
            } catch (e) {
                this.presets = {};
                this.add('Default', conf.preset);
                console.warn('[Presets] shit happens, defaults loaded');
            }
        },
        save: function() {
            var json = JSON.stringify(this.presets);
            localStorage.setItem(this.localStorageKey, json);
        },
        add: function(name, preset) {
            this.presets[name] = preset;
            this.save();
        },
        remove: function(name) {
            delete this.presets[name];
            this.save();
        },
        clear: function() {
            this.presets = null;
            this.save();
            this.load();
        }
    });

    return new Presets();
});