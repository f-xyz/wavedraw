define(['utils', 'conf', 'jQuery'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var $ = require('jQuery');

    var PresetsManager = utils.Class({

        constructor: function Presets() {
            this.presets = {
                Default: conf.preset
            };
            this.load();
        },

        load: function() {
            console.log('loading...');
            $.ajax({
                method: 'GET',
                url: '/presets',
                dataType: 'json'
            }).success(function(data) {
                console.log('loaded');
                console.log(data);
                this.presets = data;
            }.bind(this));
        },

        add: function(name, preset) {
            this.presets[name] = preset;
            $.ajax({
                method: 'POST',
                url: '/presets/save',
                data: {
                    name: name,
                    preset: preset
                }
            }).success(function(response) {
                //
            });
        }
    });

    return new PresetsManager();
});