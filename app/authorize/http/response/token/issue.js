exports = module.exports = function(services, Schemes, Tokens, rsg) {
  
  // NOTE: Do not issue refresh tokens.
  
  return function issueToken(client, user, ares, areq, locals, cb) {
    
    function onServiceLoaded(err, service) {
      if (err) { return cb(err); }
      
      var sparms = Schemes.negotiate(client.authenticationSchemes, service.authenticationSchemes)
      
      // TODO: Possibly negotiate this based on client alg support as well.
      var params = Tokens.negotiate(service.tokenTypes);
      if (!params) { return cb(new Error('Failed to negotiate token type')); }
      
      // TODO: This should be set in `info`, in milliseconds.
      // TODO: Potentially allow user to lower this??
      var exp = new Date();
      exp.setHours(exp.getHours() + 2);

      // TODO: Externalize all IDs (user and client) - probably best via a decorator
      // TODO: Pass options containing sector identifier, etc.
      var claims = {
        subject: user.id,
        authorizedParty: client.id,
        audience: service.id,
        scope: ares.access[0].scope,
        expiresAt: exp
      }
      
      var type = params.type;
      delete params.type;
        
      params.peer = service;
      //params.algorithm = 'hmac-sha256';
      
      Tokens.encode(type, claims, params, function(err, token) {
        if (err) { return cb(err); }
        // TODO: offline access, params with scope and expires in
        
        var tparms = {
          token_type: sparms.type
        };
        return cb(null, token, tparms);
      });
    }
    
    services.get(ares.access[0].resource, onServiceLoaded);
  };
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/response/token/issueFunc';
exports['@require'] = [];
