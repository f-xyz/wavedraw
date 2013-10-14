define(['modules/sandbox', 'ngCtrls/app', 'models/processing'], function() {

    var sandbox = require('modules/sandbox');
    var waveDrawApp = require('ngCtrls/app');

    var conf = require('conf');
    var processing = require('models/processing');

    waveDrawApp.controller('controlPanelCtrl', ['$scope', function($scope) {
        $scope.preset = conf.preset;
        $scope.renderers = conf.renderers;
        $scope.processing = processing;

        $scope.showControlPanel = false;
        sandbox.on('*.toggleControlPanel', function() {
            $scope.$apply(function() {
                $scope.showControlPanel = !$scope.showControlPanel;
                if ($scope.showControlPanel) {
                    location.hash = '#/edit';
                } else {
                    location.hash = '#/';
                }
            });
        });

        sandbox.on('gallery.presetSelected', function(data) {
            $scope.preset = conf.preset = data.preset;
            // does another way exist?
            !$scope.$$phase && $scope.$digest();
        });
    }]);
});