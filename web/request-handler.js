var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http_helpers = require('./http-helpers')
// require more modules/folders here!

exports.handleRequest = function (req, res) {
 // res.end(archive.paths.list);
  if(req.url === '/'){
    if(req.method === 'GET'){
      fs.readFile(archive.paths.index, function(err,data){
        if(err){
          throw err;
        } else{
          res.end(data);
        }
      });
    }
  } else {
    var statusCode = 404;
    res.writeHead(statusCode, http_helpers.headers);
    res.end();
  }
};
