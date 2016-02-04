var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data){
    if(err){
      throw err;
    } else {
      var array = data.toString().split('\n');
      callback(array);
    }
  });
};

exports.isUrlInList = function(target, callback) {
  var isPresent;
  var list = exports.readListOfUrls(function(urls) {
    var isPresent = urls.indexOf(target) !== -1;
    callback(isPresent);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', 'UTF-8');
  callback();
};

exports.isUrlArchived = function(url, callback) {
  var filePath = exports.paths.archivedSites + '/' + url;
  fs.stat(filePath, function(err, stat) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    var filePath = exports.paths.archivedSites + '/' + url;
    getHTML(url, function(body) { 
      fs.writeFile(filePath, body, function(err) {
        if (err) {
          throw err;
        }
      });
    });
  });
};

var getHTML = function(url, callback) {
  url = 'http://' + url;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  });
};
