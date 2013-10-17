define(['ngCtrls/app', 'modules/sandbox', 'modules/presetManager', 'models/rgba'], function() {

    var sandbox = require('modules/sandbox');
    var waveDrawApp = require('ngCtrls/app');

    var conf = require('conf');
    var presetMan = require('modules/presetManager');

    var Rgba = require('models/rgba');

    waveDrawApp.controller('toolbarCtrl', ['$scope', function($scope) {
        $scope.fps = 0;
        $scope.particles = 0;
        $scope.running = false;

        $scope.getFpsColor = function() {
            if ($scope.fps === 0) {
                return '';
            } else {
                var cold = new Rgba(50, 255, 50, 1);
                var hot = new Rgba(255, 50, 50, 1);
                var color = cold.mix(hot, Math.max(0, Math.min(1, 1 - ($scope.fps-30)/30)));
                return 'color: ' + color.toString(true);
            }
        };

        $scope.getIndicatorClass = function() {
            return $scope.running ? 'on' : 'off';
        };

        $scope.showControlPanel = false;
        $scope.getControlPanelStateClass = function() {
            return $scope.showControlPanel ? 'down' : 'up';
        };

        $scope.showGallery = false;
        $scope.getGalleryStateClass = function() {
            return $scope.showGallery ? 'down' : 'up';
        };


        $scope.presetName = '';
        $scope.save = function() {
            if ($scope.presetName) {
                var size = { x: 100, y: 50 };
                var canvas = document.getElementById('viewport');
                var buffer = document.createElement('canvas');
                var bufferCtx = buffer.getContext('2d');
                bufferCtx.canvas.width = size.x;
                bufferCtx.canvas.height = size.y;
                bufferCtx.drawImage(
                    canvas,
                    0, 0, canvas.clientWidth, canvas.clientWidth / 2,
                    0, 0, size.x, size.y
                );
                conf.preset.preview = buffer.toDataURL();
                console.log('saving ' + $scope.presetName + ' / ' + conf.preset.preview.length);
                presetMan.add($scope.presetName, conf.preset, function() {
                    console.log('saved');
                });
            }
        };

        sandbox.on('viewport.start', function() {
            $scope.$apply(function() { $scope.running = true; });
        });

        sandbox.on('viewport.stop', function() {
            $scope.$apply(function() { $scope.running = false; });
        });

        sandbox.on('viewport.fpsMeasured', function(fps) {
            $scope.$apply(function() { $scope.fps = fps; });
        });

        sandbox.on('world.particlesChanged', function(count) {
            $scope.$apply(function() { $scope.particles = count; });
        });

        sandbox.on('gallery.presetSelected', function(data) {
            $scope.presetName = data.name;
        });

        sandbox.on('*.toggleControlPanel', function() {
            $scope.$apply(function() { $scope.showControlPanel = !$scope.showControlPanel; });
        });

        sandbox.on('*.toggleGallery', function() {
            $scope.$apply(function() { $scope.showGallery = !$scope.showGallery; });
        });

        sandbox.on('*.hidePanels', function() {
            // todo
        });
    }]);

});