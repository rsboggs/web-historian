var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http_helpers = require('./http-helpers');
var _ = require('underscore');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  
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
  }

  archive.isUrlArchived(req.url, function(isArchived) {
    var url = req.url.slice(1);
    console.log('url', url);
    console.log('isArchived', isArchived);
    if (!isArchived) {
      var statusCode = 404;
      res.writeHead(statusCode, http_helpers.headers);
      res.end();
    } else {
      if(req.method === 'GET') {
        var filePath = archive.paths.archivedSites + '/' + url;
        // console.log('filePath',filePath);
        fs.readFile(filePath, function(err,data){
          // console.log('err',err);
          console.log('data',data);
          if(err){
            throw err;
          } else{
            res.end(data);
          }
        });
      } 
    }
  });
};
