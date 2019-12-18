var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Request(client, user) {
  EventEmitter.call(this);
  this.client = client;
  this.user = user;
}

util.inherits(Request, EventEmitter);


module.exports = Request;
