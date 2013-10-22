define(['utils', 'conf', 'jQuery', 'angular'], function() {
        'use strict';

        var utils = require('utils');
        var conf = require('conf');
        var $ = require('jQuery');
        var angular = require('angular');

        var PresetsManager = utils.Class({

            constructor: function Presets() {
                this.presets = conf.presets;
            },

            save: function(name, preset, callback) {
                this.presets[name] = preset;

                $.ajax({
                    method: 'POST',
                    url: '/presets/save',
                    dataType: 'json',
                    data: angular.toJson({
                        name: name,
                        preset: preset
                    })
                }).success(function(response) {
                    this.presets[name] = response.oldPreset;
                    this.presets[response.newName] = preset;
                    callback(response);
                }.bind(this));
            }
        });

        return new PresetsManager();
    }
);