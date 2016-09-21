exports = module.exports = function(acs) {
  
  return function issueCode(client, redirectURI, user, ares, areq, locals, cb) {
    var bound = {
      client: client,
      redirectURI: redirectURI,
      user: user,
      service: locals.service,
      grant: locals.grant,
      scope: ares.scope
    };
    
    acs.store(bound, function(err, code) {
      if (err) { return cb(err); }
      return cb(null, code);
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/oauth2/ACS' ];
