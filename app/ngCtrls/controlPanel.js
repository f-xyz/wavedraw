define(['conf', 'models/processing', 'ngCtrls/app'], function() {
    'use strict';

    var conf = require('conf');
    var processing = require('models/processing');
    var waveDrawApp = require('ngCtrls/app');

    waveDrawApp.controller('controlPanelCtrl', [
        '$scope', 'sandbox',
        function($scope, sandbox) {

            $scope.preset = conf.preset;
            $scope.renderers = conf.renderers;
            $scope.processing = processing;

            $scope.showControlPanel = false;

            sandbox.on('ui.toggleControlPanel', function() {
                $scope.showControlPanel = !$scope.showControlPanel;
                if ($scope.showControlPanel) {
                    location.hash = '#/edit';
                } else {
                    location.hash = '#/';
                }
            });

            sandbox.on('ui.presetSelected', function(data) {
                $scope.preset = data.preset;
            });
        }
    ]);
});