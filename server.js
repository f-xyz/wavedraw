var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('test');
}).listen(process.env.PORT || 5000);
