var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    console.log(req);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('test');
}).listen(10000);