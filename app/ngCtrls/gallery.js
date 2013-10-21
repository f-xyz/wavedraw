define(['conf', 'modules/presetManager', 'ngCtrls/app'], function() {
    'use strict';

    var conf = require('conf');
    var presetMan = require('modules/presetManager');
    var waveDrawApp = require('ngCtrls/app');

    waveDrawApp.controller('galleryCtrl', [
        '$scope', 'sandbox',
        function($scope, sandbox) {

            $scope.showGallery = false;
            $scope.presets = presetMan.presets;

            $scope.select = function(name) {
                var preset = $scope.presets[name];
                if (preset) {
                    conf.preset = preset;
                    sandbox.trigger('ui.toggleGallery');
                    sandbox.trigger('ui.presetSelected', {
                        name: name,
                        preset: preset
                    });
                }
            };

            sandbox.on('ui.toggleGallery', function() {
                $scope.showGallery = !$scope.showGallery;
                if ($scope.showGallery) {
                    location.hash = '#/gallery';
                } else {
                    location.hash = '#/';
                }
            });
        }
    ]);

});