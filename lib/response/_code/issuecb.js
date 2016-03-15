exports = module.exports = function(acs) {
  
  return function issueCode(client, redirectURI, user, ares, areq, info, cb) {
    var bound = {
      client: client,
      redirectURI: redirectURI,
      user: user,
      service: info.service,
      grant: info.grant,
      scope: ares.scope
    };
    
    acs.store(bound, function(err, code) {
      if (err) { return cb(err); }
      return cb(null, code);
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/oauth2/ACS' ];
