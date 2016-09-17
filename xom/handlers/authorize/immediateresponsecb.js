exports = module.exports = function(Audience, services) {
  var oauth2orize = require('oauth2orize');
  
  return function immediateResponse(client, user, scope, type, areq, locals, cb) {
    if (!user) {
      return cb(null, false, { prompt: 'login' });
    }
    
    
    Audience.infer(client, user, areq, function(err, audience) {
      if (err) { return cb(err); }
      
      services.query(audience, function(err, service) {
        if (err) { return cb(err); }
        // TODO: Return error if no service or use defaults???
        
        // TODO: Metadata about the service needed when issuing a token should be
        //       serailized for later use, as an optimization to avoid a query.
        
        var locals = {
          service: service
        }
        // TODO: Implement a way to check for already existing policies/grants
        return cb(null, false, { prompt: 'consent' }, locals);
      });
    });
    
    /*
    if (areq.webMessageTarget) {
      // FIXME: Hack for testing
      console.log('RETURN IMMEDIATE...');
      return cb(null, true, { scope: undefined, expiresAt: '1', allow: true })
    }
    */
    
    // TODO: May not ever want to respond immidiate to public apps?  This is optional, make
    //       injectable
    
    // TODO: Make this part of authorization policy, probably a decorator
    /*
    ok = false;
    for (i = 0, len = client.responseTypes.length; i < len; ++i) {
      ulist = new UnorderedList(client.responseTypes[i]);
      if (ulist.equalTo(type)) {
        ok = true;
        break;
      }
    }
    if (!ok) { return cb(new oauth2orize.AuthorizationError('Client \'' + client.id + '\' not allowed to use response type \'' + type + '\'', 'unauthorized_client')); }
    */
    
    // TODO: Implement some way to infer audience from client, user, scope
    // TODO: Implement some way to authorize scopes, users, etc on a per-audience basis.
    
    // TODO: Allow for audience (aka resource server/service) specific scope
    // TODO: Make this part of authorization policy
    /*
    if (scope) {
      var allowedScope = client.scope || [];
      for (i = 0, len = scope.length; i < len; ++i) {
        if (allowedScope.indexOf(scope[i]) == -1) {
          return cb(new oauth2orize.AuthorizationError('Client \'' + client.id + '\' not allowed to request scope \'' + scope[i] + '\'', 'unauthorized_client'));
        }
      }
    }
    */
    
    // TODO: Implement some way to authorize things, using a decorator
    /*
    var req = {
      rel: 'oauth2-authorize',
      user: user,
      client: client
    };
    
    authorize(req, function(err) {
      return cb(null, false);
    });
    */
  };
};

exports['@require'] = [
  'http://schemas.modulate.io/js/aaa/audience',
  'http://schemas.modulate.io/js/aaa/services/Directory'
];
