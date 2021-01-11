var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Response() {
  EventEmitter.call(this);
}

util.inherits(Response, EventEmitter);



Response.prototype.prompt = function(name, options) {
  this.emit('__prompt__', name, options);
  this.end();
}

Response.prototype.permit = function(scope) {
  this.emit('decision', true, scope);
  this.end();
}

Response.prototype.deny = function() {
  this.emit('decision', false);
  this.end();
}

Response.prototype.indeterminate = function() {
  this.emit('decision', undefined);
  this.end();
}

Response.prototype.na =
Response.prototype.notApplicable = function() {
  this.emit('decision', null);
  this.end();
}

Response.prototype.end = function() {
  this.emit('end');
}


module.exports = Response;
