var uid = require('uid2');


function RedisACS(client) {
  this._client = client;
}

RedisACS.prototype.decode = function(token, cb) {
  var self = this;
  this._client.get(token, function(err, reply) {
    if (err) { return cb(err); }
    
    var json;
    try {
      json = JSON.parse(reply);
    } catch(ex) {
      return cb(new Error('Failed to parse info bound to authorization code'));
    }
    return cb(null, json);
  });
}

RedisACS.prototype.encode = function(info, cb) {
  var key = uid(32);
  var val = JSON.stringify(info);
  
  var self = this;
  // TODO: Possibly setnx
  // TODO: add a short TTL for this (~5minutes or so)
  this._client.set(key, val, function(err, reply) {
    if (err) { return cb(err); }
    return cb(null, key);
  });
}


module.exports = RedisACS;