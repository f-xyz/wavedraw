define(['conf', 'jQuery', 'angular'], function() {
    'use strict';

    var conf = require('conf');
    var $ = require('jQuery');
    var angular = require('angular');

    // to use Angular's $http service:
    // angular.element('html').injector().get('$http');
    // oO

    return {

        savePreset: function(name, preset, callback) {

            // generate preview
            var canvas = document.getElementById('viewport');
            var buffer = document.createElement('canvas');
            var bufferCtx = buffer.getContext('2d');

            var srcSize = { x: canvas.clientWidth, y: canvas.clientHeight };
            var dstSize = { x: 200, y: 200 / srcSize.x * srcSize.y };

            bufferCtx.canvas.width = dstSize.x;
            bufferCtx.canvas.height = dstSize.y;

            bufferCtx.drawImage(
                canvas,
                0, 0, srcSize.x, srcSize.y,
                0, 0, dstSize.x, dstSize.y
            );

            conf.preset.preview = buffer.toDataURL();

            //
            $.ajax({
                method: 'POST',
                url: '/presets/save',
                dataType: 'json',
                data: angular.toJson({
                    name: name,
                    preset: preset
                })
            }).success(function(response) {
                conf.presets[response.name] = preset;
                callback && callback(response.name);
            });
        },

        saveImage: function(callback) {

            // make in full screen size
            var canvas = document.getElementById('viewport');
            var buffer = document.createElement('canvas');
            var bufferCtx = buffer.getContext('2d');

            var srcSize = { x: canvas.clientWidth, y: canvas.clientHeight };
            var dstSize = { x: screen.width, y: screen.height };

            bufferCtx.canvas.width = dstSize.x;
            bufferCtx.canvas.height = dstSize.y;

            bufferCtx.fillStyle = 'black';
            bufferCtx.fillRect(0, 0, dstSize.x, dstSize.y);

            bufferCtx.drawImage(
                canvas,
                0, 0, srcSize.x, srcSize.y,
                (dstSize.x - srcSize.x) / 2, (dstSize.y - srcSize.y) / 2, srcSize.x, srcSize.y
            );

            var imageData = buffer.toDataURL();

            //
            $.ajax({
                method: 'POST',
                url: '/download/save',
                dataType: 'json',
                data: imageData
            }).success(function(response) {
                var hiddenFrame = document.getElementById('download-iframe');
                hiddenFrame.src = '/download/download?file=' + response.file;
                callback && callback(response.file);
            });
        }
    };
});