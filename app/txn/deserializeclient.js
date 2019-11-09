exports = module.exports = function(Clients) {
  return function(id, cb) {
    
    console.log('### GET CLIENT DESERIALIZE');
    
    //realms.get(id, 'clients', function(err, client) {
    Clients.get(id, function(err, client) {
      if (err) { return cb(err); }
      
      return cb(null, client);
      
    }); // realms.resolve
    
    /*
    realms.resolve('clients', function(err, realm) {
      if (err) { return cb(err); }
      
      var dir = realm.createDirectory(function() {
        // The directory is ready, continue processing by fetching the client
        // record.
    
        dir.get(id, function(err, client) {
          if (err) { return cb(err); }
          return cb(null, client);
        });
      }); // realm.createDirectory(readyListener)
      
      // TODO: Handle dir.on('error')??
      
    }); // realms.resolve
    */
  };
};

exports['@require'] = [
  'http://i.authnomicon.org/oauth2/ClientRepository'
  //'http://schemas.authnomicon.org/js/ds/realms'
];
