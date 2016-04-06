var Errors = require('./index');

var NotFoundError = module.exports = function(message, metadata) {
  Errors.call(this, 404, message, metadata);
};

NotFoundError.prototype.__proto__ = Errors.prototype.__proto__;
NotFoundError.prototype.name = 'NotFoundError';
