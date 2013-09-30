console.log('init');

require.config({
    baseUrl: 'app',
    paths: {
        jquery:     'lib/jquery/jquery.min',
        stats:      'lib/stats.js/build/stats.min',
        underscore: 'lib/underscore/underscore-min'
    },
//    shim: {
//        jquery:       { exports: "$" },
//        underscore:   { exports: '_' },
//        stats:        { exports: 'Stats' }
//    },
//    packages: ['ge'],
    urlArgs: Date.now()
});

require(['viewport'], function(Viewport) {
    console.log('require');

    var canvas = document.querySelector('canvas');
    var viewport = new Viewport(canvas);
});