var pathToRegexp = require('path-to-regexp');
var Util = require('../util');

/**
 * Route entity.
 *
 * A lot of this has been boosted shamelessly from the
 * https://github.com/expressjs/express/blob/master/lib/router module as it already
 * does the job very well. Thanks to the expressjs folks for teh güd codez.
 */
var Route = module.exports = function(method, path, handlers) {
  this.method = method;
  this.path = path;
  this.keys = [];
  this.handlers = handlers;

  this.regexp = pathToRegexp(path, this.keys);
};

Route.prototype.match = function(req) {
  if (req.method.toLowerCase() !== this.method) return false;
  if (req.path == null) return false;

  var matched = this.regexp.exec(req.path);
  if (!matched) return false;

  // Looks like we have a match. Parse out the request params.
  var keys = this.keys;
  var params = req.params;

  for (var i = 1; i < matched.length; i++) {
    var key = keys[i - 1];
    var prop = key.name;
    var val = decode_param(matched[i]);

    if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
      params[prop] = val;
    }
  }

  return true;
}

function decode_param(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      err.status = err.statusCode = 400;
    }

    throw err;
  }
}

Route.prototype.handle = function(req, res, done) {
  Util.each(this.handlers, function(handler, next) {
    handler(req, res, next);
  }, done);
};
