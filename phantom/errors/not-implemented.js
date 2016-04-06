var Errors = require('./index');

var NotImplementedError = module.exports = function(message, metadata) {
  Errors.call(this, 501, message, metadata);
};

NotImplementedError.prototype.__proto__ = Errors.prototype.__proto__;
