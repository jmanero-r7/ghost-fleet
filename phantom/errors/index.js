var STATUS_CODES = require('../util').STATUS_CODES;

var WHITESPACE = /[^a-zA-Z0-9]/g;
var NEWLINE = /\n/g;
var NOTHING = String();

var Errors = module.exports = function(code, message, metadata) {
  Error.call(this);

  this.code = Number(code) || 500;
  this.name = STATUS_CODES[this.code].replace(WHITESPACE, NOTHING);
  this.message = message || STATUS_CODES[this.code];
  this.metadata = metadata;
};

Errors.prototype.__proto__ = Error.prototype;

Errors.coerce = function(error) {
  if (error instanceof this) return error;

  var original_name = error.name;

  error.__proto__ = Errors.prototype;
  Errors.call(error, error.code, error.message);
  error.name = original_name;

  return error;
};

Errors.prototype.toString = function() {
  var error = this.name + '(' + this.code + '): ' + this.message + '\n';
  this.stack.split(NEWLINE).forEach(function(line) {
    error += '  ' + line + '\n';
  });

  return error;
};

Errors.prototype.toJSON = function() {
  return {
    code: this.code,
    name: this.name,
    message: this.message,
    metadata: this.metadata
  };
};

Errors.NotFoundError = require('./not-found');
Errors.NotImplementedError = require('./not-implemented');
