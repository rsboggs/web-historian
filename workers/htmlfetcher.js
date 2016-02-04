// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

// archive.readListOfUrls(function(urls) {
//   var urlsToDownload = [];
//   _.each(urls, function(url) {
//     archive.isUrlArhived(url, function(isArchived) { 
//       if(!isArchived) {
//         urlsToDownload.push(url);
//       }
//     });
//   });
//   archive.downloadUrls(urlsToDownload);
// });
var checkIfArchived = function(urls, callback) {
  _.each(urls, function(url) {
    archive.isUrlArchived(url, function(isArchived) { 
      if(!isArchived) {
        callback(url);
      }
    });
  });
};

var findUrlsToDownload = function(callback) {
  archive.readListOfUrls(function(urls) {
    var urlsToDownload = [];
    checkIfArchived(urls, function(url) {
      urlsToDownload.push(url);
    });
   callback(urls);
  });
}

findUrlsToDownload(function(urlsToDownload) {
  archive.downloadUrls(urlsToDownload);
});
