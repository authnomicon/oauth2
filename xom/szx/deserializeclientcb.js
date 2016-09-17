exports = module.exports = function(directory) {
  return function(id, cb) {
    // TODO: Put DirectorySelector in here
    
    directory.query(id, function(err, client) {
      if (err) { return cb(err); }
      return cb(null, client);
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/clients/Directory' ];
