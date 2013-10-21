define(['utils', 'conf', 'jQuery', 'angular', 'text!/../db/presets.json'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var $ = require('jQuery');
    var angular = require('angular');

    var presets = require('text!/../db/presets.json');
    presets = JSON.parse(presets);

    var PresetsManager = utils.Class({

        constructor: function Presets() {
            this.presets = presets;
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
                if (response.updating) {
                    this.presets[name] = response.oldPreset;
                    this.presets[response.newName] = preset;
                }
                callback(response);
            }.bind(this));
        }
    });

    return new PresetsManager();
});