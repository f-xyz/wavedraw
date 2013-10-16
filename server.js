var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var util = require('util');
var port = process.env.PORT || 5000;
var _ = util.inspect;

(function main() {

    var requestHandler = function(request, response) {
        var requestUrl = url.parse(request.url, true);
        var requestFile = process.cwd() + requestUrl.pathname;

        console.log('request ' + requestFile);

        fs.exists(requestFile, function(exists) {
            if (exists) {
                if (fs.statSync(requestFile).isDirectory()) {
                    // dir
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    var fileList = fs.readdirSync(requestFile);
                    var list = fileList.reduce(function(prev, cur) {
                        return prev + '\n' + cur;
                    });
                    response.write(list);
                    response.end('\n');
                } else {
                    // file
                    fs.readFile(requestFile, 'binary', function(err, file) {
                        if (!err) {
                            response.writeHead(200, {'Content-Type': mime.lookup(requestFile)});
                            response.write(file, 'binary');
                            response.end('\n');
                        } else {
                            error(response, 500, err);
                        }
                    });
                }
            } else {
                error(response, 404, '404 Not Found');
            }
        });
    };

    var error = function (response, code, msg) {
        response.writeHead(code, {'Content-Type': 'text/plain'});
        response.end(msg + '\n');
    };

    http.createServer(requestHandler).listen(port);

})();

console.log('[+] running on port ' + port);
