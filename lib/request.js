var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Request(client, req, user) {
  EventEmitter.call(this);
  this.client = client;
  this.prompt = req.prompt || [];
  this.user = user;
}

util.inherits(Request, EventEmitter);


module.exports = Request;
