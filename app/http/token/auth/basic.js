exports = module.exports = function(secrets, clients) {
  var Strategy = require('passport-http').BasicStrategy;
  
  return new Strategy(function(clientID, secret, cb) {
    
    secrets.verify(clientID, secret, function(err, client, info) {
      if (err) { return cb(err); }
      if (!client) { return cb(null, false); }
      
      info = info || {};
      info.methods = [ 'password' ];
      
      if (typeof client == 'object') { return cb(null, client, info); }
      clients.find(clientID, function(err, client) {
        if (err) { return cb(err); }
        return cb(null, client, info);
      });
    });
  });
};

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'client_secret_basic';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/credentials/ClientSecretService',
  'http://i.authnomicon.org/oauth2/ClientDirectory'
];
