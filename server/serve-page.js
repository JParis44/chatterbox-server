var fs = require('fs');
var url = require('url');
var path = require('path')

var mimeTypes = {
    ".html": "text/html",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".js": "text/javascript",
    ".css": "text/css"};

var clientFolder = '/client';

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

module.exports = function (request, response){

  var fileName = url.parse(request.url).pathname;
  if (fileName === '/') { fileName = '/index.html'}
  fileName = path.join(__dirname, clientFolder, fileName);
  var ext = path.extname(fileName);

  var mimeType = mimeTypes[ext];

  headers['Content-Type'] = mimeType;
  response.writeHead(200, "How ya doin, chump?", headers);

  var fileStream = fs.createReadStream(fileName);
  fileStream.pipe(response);



}
