exports = module.exports = function(Secrets, Clients) {

  return function(clientID, secret, cb) {
    
    Secrets.verify(clientID, secret, function(err, client) {
      if (err) { return cb(err); }
      if (!client) { return cb(null, false); }
      
      Clients.find(clientID, function(err, client) {
        console.log(err);
        console.log(client);
        
        if (err) { return cb(err); }
        return cb(null, client);
        
        //return cb(null, user);
      });
      
      //return cb(err, client, info)
    });
  };
};

exports['@require'] = [
  'http://i.authnomicon.org/oauth2/credentials/ClientSecretService',
  'http://i.authnomicon.org/oauth2/ClientRepository'
  //'http://schemas.authnomicon.org/js/cs/password'
];
