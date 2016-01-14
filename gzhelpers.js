// remote.js

// imports
// ======

var http = require('http');
var https = require('https');
var Promise = require('bluebird');


// Setup logging
// =============

var log = console.log.bind(console);
var debug = console.log.bind(console, 'DEBUG');
var info = console.info.bind(console);
var error = console.error.bind(console);

// remote function
// ===============

var R = {};

// I want a function that can be used like this:
// var req = createReq(options, data).then(function(data) {assert(data === JSON.stringify({...})})}

R.request = function(options, data) {
  return new Promise(function (fulfill, reject) {

    var req = http.request(options);

    req.on('response', function (res) {
      var d = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        d += chunk;
      });
      res.on('end', function() {
        fulfill(d);
      })
    });

    req.on('error', function(e) {
      reject('problem with request: ' + e.message);
    });

    // write data to request body
    if(data) {
      if(typeof data !== 'string')
        data = JSON.stringify(data);

      req.setHeader('Content-Length', data.length);
      req.write(data);
    }

    req.end();
  });

}

// exports
// =======

module.exports = {};
module.exports.remote = R;
