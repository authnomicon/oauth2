exports = module.exports = function(Code) {
  
  return function issueCode(client, redirectURI, user, ares, areq, locals, cb) {
    var bound = {
      client: client,
      redirectURI: redirectURI,
      user: user,
      permissions: ares.permissions
      // TODO
      //service: locals.service,
      //grant: locals.grant,
      //scope: ares.scope
    };
    
    // TODO: Ensure that code has a TTL of 10 minutes
    Code.encode(bound, function(err, code) {
      if (err) { return cb(err); }
      return cb(null, code);
    });
  };
};

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/issueCodeFunc';
exports['@require'] = [ 'http://schemas.authnomicon.org/js/aaa/oauth2/code' ];
