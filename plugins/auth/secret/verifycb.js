exports = module.exports = function(directory) {

  return function(clientID, secret, cb) {
    directory.query(clientID, function(err, client) {
      if (err) { return cb(err); }
      // TODO: Handle ENOTFOUND or somesuch as a undefined client
      if (!client) {
        return cb(null, false);
      }
      if (client.secret !== secret) {
        return cb(null, false);
      }
      
      return cb(null, client);
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/clients/Directory' ];
