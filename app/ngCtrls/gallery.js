define(['utils', 'conf', 'ngCtrls/app'], function() {
    'use strict';

    var utils = require('utils');
    var conf = require('conf');
    var waveDrawApp = require('ngCtrls/app');

    waveDrawApp.controller('galleryCtrl', [
        '$scope', 'sandbox',
        function($scope, sandbox) {

            $scope.showGallery = false;
            $scope.presets = conf.presets;

            $scope.select = function(name) {
                var preset = $scope.presets[name];
                if (preset) {
                    conf.preset = utils.clone(preset);
                    sandbox.trigger('ui.toggleGallery');
                    sandbox.trigger('ui.presetSelected', {
                        name: name,
                        preset: conf.preset
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