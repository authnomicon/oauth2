exports = module.exports = function(clients) {
  var Strategy = require('passport-oauth2-client-public').Strategy;
  
  return new Strategy(function(clientID, cb) {
    
    clients.find(clientID, function(err, client) {
      if (err) { return cb(err); }
      if (!client) {
        return cb(null, false);
      }
      if (client.tokenEndpointAuthMethod !== 'none') {
        // The client is not a public client and must authenticate.  Fail this
        // authentication attempt.
        return cb(null, false);
      }
      
      return cb(null, client);
    });
  });
};

exports['@implements'] = 'module:passport.Strategy';
exports['@scheme'] = 'oauth2-client-authentication/none';
exports['@require'] = [
  'module:@authnomicon/oauth2.ClientDirectory'
];
