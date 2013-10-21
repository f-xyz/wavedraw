require.config({
    baseUrl: 'app',
    paths: {
        domReady:       '../lib/requirejs-domready/domReady',
        text:           '../lib/requirejs-text/text',
        sprintf:        '../lib/sprintf/src/sprintf',
        jQuery:         '../lib/jquery/jquery',
        jQueryUi:       '../lib/jquery-ui/ui/jquery-ui',
        jQuerySelect2:  '../lib/select2/select2',
        angular:        '../lib/angular/angular',
        angularUi:      '../lib/angular-ui/build/angular-ui',
        slider:         '../lib/angular-ui-slider/src/slider',
        select2:        '../lib/angular-ui-select2/src/select2'
    },
    shim: {
        jQuery:         { exports: 'jQuery' },
        jQueryUi:       { exports: 'jQuery.ui', deps: ['jQuery'] },
        jQuerySelect2:  { exports: 'jQuery.ui', deps: ['jQuery'] },
        angular:        { exports: 'angular',   deps: ['jQuery'] },
        angularUi:      { exports: 'angular',   deps: ['angular'] },
        sprintf:        { exports: 'sprintf' },
        slider:         { exports: 'angular',   deps: ['angular'] },
        select2:        { exports: 'angular',   deps: ['angular', 'jQuery', 'jQuerySelect2'] }
    },
    urlArgs: Date.now()
});

// angular manual bootstrapping
window.name = "NG_DEFER_BOOTSTRAP!";

require(
    [
        'modules/sandbox', 'modules/viewport', 'modules/domEvents', 'modules/world', 'modules/popup',
        'angular', 'ngCtrls/app', 'ngCtrls/toolbar', 'ngCtrls/controlPanel', 'ngCtrls/gallery',
        'modules/debug'
    ],
    function() {
        'use strict';

        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });

        var angular = require('angular');
        angular.bootstrap(angular.element(document.documentElement), ['waveDraw']);

        var sandbox = require('modules/sandbox');
        if (location.hash === '#/edit') {
            sandbox.trigger('ui.toggleControlPanel');
        } else if (location.hash === '#/gallery') {
            sandbox.trigger('ui.toggleGallery');
        } else {
            location.hash = '#/draw';
        }
    }
);