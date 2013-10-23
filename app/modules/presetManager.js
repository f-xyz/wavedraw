define(['utils', 'conf', 'jQuery', 'angular'], function() {
        'use strict';

        var utils = require('utils');
        var conf = require('conf');
        var $ = require('jQuery');
        var angular = require('angular');

        var PresetsManager = utils.Class({
            constructor: function Presets() {},
            save: function(name, preset, callback) {
                $.ajax({
                    method: 'POST',
                    url: '/presets/save',
                    dataType: 'json',
                    data: angular.toJson({
                        name: name,
                        preset: preset
                    })
                }).success(function(response) {
                    conf.presets[response.name] = preset;
                    callback(response);
                }.bind(this));
            }
        });

        return new PresetsManager();
    }
);