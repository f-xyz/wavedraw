define(['conf', 'modules/presetManager', 'models/rgba', 'angular', 'ngCtrls/app'], function() {
    'use strict';

    var conf = require('conf');
    var presetMan = require('modules/presetManager');
    var RGBA = require('models/rgba');
    var angular = require('angular');
    var waveDrawApp = require('ngCtrls/app');

    waveDrawApp.controller('toolbarCtrl', [
        '$scope', '$timeout', '$http', 'sandbox',
        function($scope, $timeout, $http, sandbox) {

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

                    // generate preview
                    var canvas = document.getElementById('viewport');
                    var srcSize = { x: canvas.clientWidth, y: canvas.clientHeight };
                    var dstSize = { x: 200, y: 200 / srcSize.x * srcSize.y };
                    var buffer = document.createElement('canvas');
                    var bufferCtx = buffer.getContext('2d');
                    bufferCtx.canvas.width = dstSize.x;
                    bufferCtx.canvas.height = dstSize.y;
                    bufferCtx.drawImage(
                        canvas,
                        0, 0, srcSize.x, srcSize.y,
                        0, 0, dstSize.x, dstSize.y
                    );
                    conf.preset.preview = buffer.toDataURL();

                    // show progress animation
                    $scope.working = true;

                    // save
                    presetMan.save($scope.presetName, conf.preset, function(response) {
                        $scope.$apply(function() {

                            $scope.presetName = response.name;

                            // hide progress animation
                            $scope.working = false;
                            $scope.done = true;
                            $timeout(function() {
                                $scope.done = false;
                            }, 1000);
                        });
                    });
                }
            };

            $scope.download = function() {
                var screenSize = {
                    x: screen.width,
                    y: screen.height
                };
                //
                var canvas = document.getElementById('viewport');
                var data = {
//                    data: canvas.toDataURL(),
                    size: screenSize
                };
                data = angular.toJson(data);
                console.log(data);
                $http.post('/download', data).success(function(response) {
                    console.log(response);
                });
            };

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