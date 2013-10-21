define(['modules/sandbox', 'angular', 'jQuery', 'jQueryUi', 'slider', 'select2'], function() {
    'use strict';

    var sandbox = require('modules/sandbox');
    var waveDrawApp = angular.module('waveDraw', ['ui.slider', 'ui.select2']);

    // angular <=> sandbox bridge service
    waveDrawApp.factory('sandbox', function($rootScope) {

        var slice = Array.prototype.slice;

        var service = {

            _enabled: true,

            on: function(event, callback) {
                $rootScope.$on(event, function() {
                    var args = slice.call(arguments, 1);
                    callback.apply($rootScope, args);
                });
            },

            trigger: function(/*event, args*/) {
                this._enabled = false;
                sandbox.trigger.apply(sandbox, arguments);
                this._enabled = true;
            },

            _sandboxToAngular: function(/*event, args*/) {
                if (this._enabled) {
                    $rootScope.$broadcast.apply($rootScope, arguments);
                    $rootScope.$digest();
                } else {
                    var args = slice.call(arguments);
                    setTimeout(function() {
                        this._sandboxToAngular.apply(this, args);
                    }.bind(this), 0);
                }
            }
        };

        // trigger sandbox events as angular ones
        sandbox.onAll(function() {
            service._sandboxToAngular.apply(service, arguments);
        });

        return service;
    });

    waveDrawApp.directive('ngFocus', ['$parse', function($parse) {
        return function($scope, element, attr) {
            var callback = $parse(attr['ngFocus']);
            element.bind('focus', function(event) {
                $scope.$apply(function() {
                    callback($scope, { $event: event });
                });
            });
        }
    }]);

    waveDrawApp.directive('ngBlur', ['$parse', function($parse) {
        return function($scope, element, attr) {
            var callback = $parse(attr['ngBlur']);
            element.bind('blur', function(event) {
                $scope.$apply(function() {
                    callback($scope, { $event: event });
                });
            });
        }
    }]);

    return waveDrawApp;
});