require.config({
    baseUrl: 'app',
    paths: {
        jQuery:     '../lib/jquery/jquery',
        jQueryUi:   '../lib/jquery-ui/ui/jquery-ui',
        stats:      '../lib/stats.js/src/Stats',
        angular:    '../lib/angular/angular',
        angularUi:  '../lib/angular-ui/build/angular-ui',
        domReady:   '../lib/requirejs-domready/domReady',
        sprintf:    '../lib/sprintf/src/sprintf',
        slider:     '../lib/angular-ui-slider/src/slider',
        select2:    '../lib/angular-ui-select2/src/select2',
        select2c:   '../lib/select2/select2'
    },
    shim: {
        jQuery:     { exports: 'jQuery' },
        jQueryUi:   { exports: 'jQuery.ui', deps: ['jQuery'] },
        angular:    { exports: 'angular', deps: ['jQuery'] },
        angularUi:  { exports: 'angular', deps: ['angular'] },
        stats:      { exports: 'Stats' },
        sprintf:    { exports: 'sprintf' },
        slider:     { exports: 'angular', deps: ['angular'] },
        select2:    { exports: 'angular', deps: ['angular', 'select2c'] },
        select2c:   { exports: 'angular', deps: ['jQuery'] }
    },
    urlArgs: Date.now()
});

// ох уж этот ангуляр
window.name = "NG_DEFER_BOOTSTRAP!";

require(
    ['domReady', 'utils', 'conf', 'stats', 'jQuery', 'jQueryUi', 'angular', 'slider', 'select2',
     'modules/sandbox', 'modules/viewport', 'modules/domEvents', 'modules/world', 'modules/presets',
     'modules/debug',
     'models/processing', 'models/renderers'],
    function() {
        'use strict';

        var domReady = require('domReady');
        domReady(function() {

            var angular = require('angular');
            var waves = angular.module('waves', ['ui.slider', 'ui.select2']);

            waves.controller('navbar', ['$scope', function($scope) {
                //
            }]);

            waves.controller('config', ['$scope', function($scope) {
                $scope.conf = require('conf').preset;
                $scope.processing = require('models/processing');
                $scope.renderers = require('models/renderers');

                $scope.presetMan = require('modules/presets');
                $scope.preset = 'Default';
                $scope.presetName = $scope.preset;

                $scope.load = function(name) {
                    $scope.presetName = name;

                    var conf = $scope.presetMan.presets[name];
                    console.log('load', conf.processing.effects);

                    (function roll(src, dst) {
                        for (var key in src) {
                            if (src.hasOwnProperty(key)) {
                                var value = src[key];
                                if (typeof(value) === 'object') {
                                    dst[key] = src[key];
                                    roll(value, dst[key]);
                                } else {
                                    dst[key] = value;
                                }
                            }
                        }
                    })(conf, $scope.conf);

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                    console.log(window.conf.preset.processing.effects);
                };

                $scope.save = function(name) {
                    if (name) {

                        $scope.presetMan.add(name, $scope.conf);
                        $scope.preset = name;

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    }
                };

                $scope.remove = function(name) {
                    if (name !== 'Default') {
                        $scope.presetMan.remove(name);
                        $scope.preset = 'Default';
                    }
                };

            }]);
            angular.bootstrap(angular.element(document.body), ['waves']);
        });
    }
);