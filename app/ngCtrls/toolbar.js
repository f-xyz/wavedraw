define(['conf', 'models/rgba', 'services/backend', 'ngCtrls/app'], function() {
    'use strict';

    var conf = require('conf');
    var RGBA = require('models/rgba');
    var backend = require('services/backend');
    var waveDrawApp = require('ngCtrls/app');

    waveDrawApp.controller('toolbarCtrl', [
        '$scope', '$timeout', '$location', 'sandbox',
        function($scope, $timeout, $location, sandbox) {

            $scope.running = false;
            $scope.particles = 0;
            $scope.fps = 0;

            $scope.showControlPanel = false;
            $scope.showGallery = false;

            $scope.working = false;
            $scope.done = false;

            // view helpers
            $scope.getIndicatorClass            = function() { return $scope.running ? 'on' : 'off'; };
            $scope.getControlPanelStateClass    = function() { return $scope.showControlPanel ? 'down' : 'up'; };
            $scope.getGalleryStateClass         = function() { return $scope.showGallery ? 'down' : 'up'; };
            $scope.getFpsColor                  = function() {
                if ($scope.fps === 0) {
                    return '';
                } else {
                    var cold = new RGBA(50, 255, 50, 1);
                    var hot  = new RGBA(255, 50, 50, 1);
                    var color = cold.mix(hot, Math.max(0, Math.min(1, 1 - ($scope.fps-30)/30)));
                    return 'color: ' + color.toString(RGBA.FORMAT_HEX);
                }
            };

            // ng-click handlers
            $scope.toggleControlPanel   = function() { sandbox.trigger('ui.toggleControlPanel'); };
            $scope.toggleGallery        = function() { sandbox.trigger('ui.toggleGallery'); };
            $scope.share                = function() { sandbox.trigger('ui.share'); };
            $scope.fullScreen           = function() { sandbox.trigger('viewport.fullScreen'); };
            $scope.reset                = function() { sandbox.trigger('viewport.reset'); };
            $scope.toggle               = function() { sandbox.trigger('viewport.toggle'); };

            // save preset
            $scope.presetName = '';
            $scope.save = function() {
                if ($scope.presetName) {
                    $scope.working = true;

                    backend.savePreset($scope.presetName, conf.preset, function(name) {
                        $scope.$apply(function() {

                            $scope.presetName = name;

                            $scope.working = false;
                            $scope.done = true;
                            $timeout(function() { $scope.done = false; }, 1000);
                        });
                    });
                }
            };

            // download PNG
            $scope.download = function() {
                backend.saveImage();
            };

            // sandbox handlers
            sandbox.on('ui.download',           function() { $scope.download(); });
            sandbox.on('ui.toggleControlPanel', function() { $scope.showControlPanel = !$scope.showControlPanel; });
            sandbox.on('ui.toggleGallery',      function() { $scope.showGallery = !$scope.showGallery; });
            sandbox.on('ui.presetSelected',     function(data) {
                $scope.presetName = data.name;
                $scope.showGallery = false;
            });

            sandbox.on('viewport.start',         function() { $scope.running = true; });
            sandbox.on('viewport.stop',          function() { $scope.running = false; });
            sandbox.on('viewport.fpsMeasured',   function(fps) { $scope.fps = fps });
            sandbox.on('world.particlesChanged', function(count) { $scope.particles = count; });
        }
    ]);

});