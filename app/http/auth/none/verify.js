exports = module.exports = function(directory) {

  return function(clientID, cb) {
    console.log('FIXME: http/auth/none/verify in oauth2');
    
    directory.query(clientID, function(err, client) {
      if (err) { return cb(err); }
      // TODO: Handle ENOTFOUND or somesuch as a undefined client
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
  };
};

exports['@require'] = [
  //'http://schemas.modulate.io/js/aaa/clients/Directory'
];
