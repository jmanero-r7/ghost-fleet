var MIME = require('mime');
var QS = require('qs');

var Request = module.exports = function() {
  var urlParts = this.url.split('?');

  this.path = urlParts[0];
  this.params = {};
  if (urlParts.length > 1) this.query = QS.parse(uri[1]);
}

Request.create = function(req) {
  req.__proto__ = this.prototype;
  this.call(req);

  return this;
};

Request.prototype.type = function(query) {
  return MIME.extension(this.headers['Content-Type']) == query;
};
