var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var mime = require('mime');
var util = require('util');
var events = require('events');
var async = require('async');

var app = {

    indexes: ['index.html'],
    forbidden: [/\.git/],
    port: process.env.PORT || 5000,
    routes: [ /^\/(\w+)\/?(\w*)(.*)/ ],

    listen: function() {
        this.server = http.createServer(this.request.bind(this));
        this.server.listen(this.port);
        this.log('[main] started on port ' + this.port);
    },

    request: function(request, response) {
        var requestUrl = url.parse(request.url, true);
        var path = process.cwd() + requestUrl.pathname;
        var message;

        if (this.isForbidden(requestUrl.pathname)) {

            message = '403 Forbidden';
            this.log(message + ': ' + path);
            this.error(response, 403, message);

        } else if (fs.existsSync(path)) {

            this.log('200 OK: ' + path);
            if (this.isDirectory(path)) {
                var i, index;
                for (i in this.indexes) {
                    index = path + this.indexes[i];
                    if (fs.existsSync(index)) {
                        this.processFile(response, index);
                        return;
                    }
                }
                this.processDirectory(response, path);
            } else {
                this.processFile(response, path);
            }

        } else if (!this.processController(request, response, requestUrl)) {

            message = '404 Not Found';
            this.log(message + ': ' + path);
            this.error(response, 403, message);

        }
    },

    isForbidden: function(path) {
        return false;
//        return this.forbidden.some(function(regExp) {
//            return regExp.test(path);
//        });
    },

    isDirectory: function(path) {
        return fs.statSync(path).isDirectory();
    },

    processDirectory: function(response, path) {
        response.writeHead(200, {'Content-Type': 'text/html'});

        var fileList = fs.readdirSync(path);
        fileList.unshift('..');

        var linkify = function(path) {
            return '<a href="">' + path + '</a>'
        };
        var list = fileList.reduce(function(prev, cur) {
            return linkify(prev) + '<br>\n' + linkify(cur);
        });

        response.write('Directory: ' + path + '<br>\n' + list);
        response.end('\n');
    },

    processFile: function(response, path) {
        fs.readFile(path, 'binary', function(err, file) {
            if (!err) {
                response.writeHead(200, {'Content-Type': mime.lookup(path)});
                response.write(file, 'binary');
                response.end('\n');
            } else {
                var message = '500 Internal Server Error';
                this.log(message + ': ' + err);
                this.error(response, 500, err);
            }
        }.bind(this));
    },

    processController: function(request, response, url) {
        var i, regExp, parts;
        for (i in this.routes) {
            regExp = this.routes[i];
            parts = regExp.exec(url.path);
            if (parts) {
                var controller = controllers[parts[1]];
                if (controller) {
                    var action = controller[parts[2]]
                        || controller.index;
                    if (action) {
//                        try {
                        action.call(controller, request, response, url);
//                        } catch (exc) {
//                            app.error(response, 500, e.message);
//                        }
                        return true;
                    } else {
                        app.error(response, 500, 'No action: ' + parts[1] + '/' + parts[2]);
                    }
                } else {
                    app.error(response, 500, 'No controller: ' + parts[1]);
                }
            }
        }
        return false;
    },

    log: function(msg) {
        console.log(msg);
    },

    error: function(response, code, msg) {
        response.writeHead(code, {'Content-Type': 'text/plain'});
        response.end(msg + '\n');
    }
};

var controllers = {
    presets: {
        index: function(request, response) {
            presets.load(function(presets) {
                response.writeHead(200, {'Content-Type': 'text/json'});
                response.write(JSON.stringify(presets));
                response.end('\n');
            });
        },
        save: function(request, response) {
            var post = '';
            request.addListener('data', function(chunk) { post += chunk; });
            request.addListener('end', function() {
                post = qs.parse(post);
                presets.save(post.name, post.preset, function() {
                    response.writeHead(200, {'Content-Type': 'text/json'});
                    response.write(JSON.stringify({ok: true}));
                    response.end('\n');
                });
            });
        }
    },
    download: function(request, response) {
        var post = '';
        request.addListener('data', function(chunk) { post += chunk; });
        request.addListener('end', function() {
            post = qs.parse(post);
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write(post);
            response.end();
        });
    }
};

var presets = {
    dbPath: 'db/presets.json',
    presets: null,
    load: function(callback) {
        if (this.presets) {
            callback(this.presets);
        } else {
            fs.readFile(this.dbPath, function(err, file) {
                if (err) throw new Error(err);
                this.presets = JSON.parse(file);
                callback(this.presets);
            }.bind(this));
        }
    },
    save: function(name, preset, callback) {
        this.load(function() {
            this.presets[name] = preset;
            var json = JSON.stringify(this.presets);
            fs.writeFile(this.dbPath, json, function(err) {
                if (err) throw new Error(err);
                callback();
            });
        }.bind(this));
    }
};

app.listen();