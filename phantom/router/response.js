var MIME = require('mime');

var Response = module.exports = function() {};

Response.create = function(res) {
  res.__proto__ = this.prototype;
  this.call(res);

  return this;
};

Response.prototype.status = function status(code) {
  this.statusCode = code;
  return this;
};

Response.prototype.type = function contentType(type) {
  var ct = type.indexOf('/') === -1 ? MIME.lookup(type) : type;
  this.setHeader('Content-Type', ct);

  return this;
};

Response.prototype.send = function(body) {
  this.setHeader('Content-Length', body.length);

  this.write(body);
  this.closeGracefully();

  return this;
};

Response.prototype.json = function(body) {
  this.type('application/json');
  return this.send(JSON.stringify(body, null, 2));
};

Response.prototype.redirect = function(uri) {
  this.status(302);
  this.setHeader('Location', uri);

  return this.json({
    code: 203,
    location: uri
  });
};
