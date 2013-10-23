define(['conf', 'jQuery', 'angular'], function() {
        'use strict';

        var conf = require('conf');
        var $ = require('jQuery');
        var angular = require('angular');

        return {
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
            },
            download: function(size, data, callback) {
                //
            }
        };
    }
);