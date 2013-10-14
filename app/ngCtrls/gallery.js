define(['ngCtrls/app', 'modules/sandbox', 'modules/presetManager'], function() {

    var sandbox = require('modules/sandbox');
    var presetMan = require('modules/presetManager');
    var waveDrawApp = require('ngCtrls/app');

    waveDrawApp.controller('galleryCtrl', ['$scope', function($scope) {
        $scope.showGallery = false;
        $scope.presets = presetMan.presets;

        $scope.select = function(name) {
            var preset = $scope.presets[name];
            if (preset) {
                $scope.showGallery = false;
                sandbox.trigger('gallery.presetSelected', {
                    name: name,
                    preset: preset
                });
            }
        };

        sandbox.on('*.toggleGallery', function() {
            $scope.$apply(function() {
                $scope.showGallery = !$scope.showGallery;
                if ($scope.showGallery) {
                    location.hash = '#/gallery';
                } else {
                    location.hash = '#/';
                }
            });
        });
    }]);

});