var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http_helpers = require('./http-helpers');
var _ = require('underscore');

var handlePost = function(request, response) {
  var url = '';
  request.on('data', function(chunk) {
    url += chunk;
  });
  request.on('end', function() {
    url = url.slice(4);
    archive.isUrlInList(url, function(isPresent) {
      if(!isPresent) {
        archive.addUrlToList(url, _.identity);
        routeToLoadingPage(url, response);
      } else {
        archive.isUrlArchived(url, function(isArchived) {
          if(isArchived) {
            routeToArchivedPage(url, response);
          } else {
            routeToLoadingPage(url, response);
          }
        });
      }
    });
  })
};

var routeToLoadingPage = function(url, response) {
  var statusCode = 302;
  response.writeHead(statusCode, http_helpers.headers);
  fs.readFile(archive.paths.loading, function(err,data){
    if(err){
      throw err;
    } else{
      response.end(data);
    }
  });
};

var routeToArchivedPage = function(url, response) {
  var statusCode = 302;
  response.writeHead(statusCode, http_helpers.headers);
  var filePath = archive.paths.archivedSites + '/' + url;
  fs.readFile(filePath, function(err,data){
    if(err){
      throw err;
    } else{
      response.end(data);
    }
  });
};


exports.handleRequest = function (req, res) {
  console.log('req', req.method);
  if(req.url === '/') {
    if(req.method === 'GET'){
      fs.readFile(archive.paths.index, function(err,data){
        if(err){
          throw err;
        } else{
          res.end(data);
        }
      });
    } else if (req.method === 'POST') {
      handlePost(req, res);
    }
  } else {
    archive.isUrlArchived(req.url, function(isArchived) {
      var url = req.url.slice(1);
      if (!isArchived) {
        var statusCode = 404;
        res.writeHead(statusCode, http_helpers.headers);
        res.end();
      } else {
        if(req.method === 'GET') {
          var filePath = archive.paths.archivedSites + '/' + url;
          fs.readFile(filePath, function(err,data){
            if(err){
              throw err;
            } else{
              res.end(data);
            }
          });
        } 
      }
    });
  }
};
