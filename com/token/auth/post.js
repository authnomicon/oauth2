exports = module.exports = function(secrets, clients) {
  var Strategy = require('passport-oauth2-client-password').Strategy;
  
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

exports['@implements'] = 'module:passport.Strategy';
exports['@scheme'] = 'oauth2-client-authentication/client_secret_post';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/ClientSecretService',
  'http://i.authnomicon.org/oauth2/ClientDirectory'
];
