exports = module.exports = function(pdp, resourcesDir, Audience) {
  var oauth2orize = require('oauth2orize');
  
  return function immediateResponse(client, user, scope, type, areq, locals, cb) {
    if (areq.prompt && areq.prompt.indexOf('none') !== -1) {
      // FIXME: Do this properly
      //return cb(null, true);
      return cb(new oauth2orize.AuthorizationError('Interaction with user is required to proceed', 'interaction_required', null, 400));
    }
    
    
    if (!user) {
      if (locals && locals.authN && locals.authN.failureCount >= 3) {
        return cb(new oauth2orize.AuthorizationError('Too many login failures', 'access_denied'));
      }
      return cb(null, false, { prompt: 'login', maxAttempts: 3 });
    }
    
    // TODO: Put this in for MFA
    /*
    if (locals.authN && locals.authN.methods.length == 1) {
      return cb(null, false, { prompt: 'mfa' });
    }
    */
    
    
    // TODO: OIDC parameters to understand here:
    // display, ui_locales, acr_values
    // TODO: If sub claim is requested with specific value, must only reply with that user,
    // otherwise error.  OIDC 3.1.2.2
    // TODO: Must have nonce if oidc implicit flow.  see 3.2.2.1.
    
    
    // TODO: In oauth2orize-permission, parse `storagerelay` URLs and set req.origin.
    // TODO: Implement registered webOrigin check in immediateModeCb.  It is safe to use
    //       unregistered value to reply to clients, as redirect is not involved
    /*
    if (client.webOrigins && client.webOrigins.length) {
      if (!areq.origin) {
        locals.webOrigin = client.webOrigins[0];
      } else if (client.webOrigins.indexOf(areq.origin) != -1) {
        locals.webOrigin = areq.origin;
        locals.webOrigin = 'http://localhost:3001';
      }
    }
    */
    
    
    // TODO: reference undefined variable causes bad stack trace.  find and fix
    //push(consent)
    
    var consents = locals.consent || [];
    //if (locals.consent) {
    //  consents.push(locals.consent);
    //}
    
    
    function onDecisionReached(resources, decisions) {
      var locals = {
        resources: resources,
        decisions: decisions,
        consents: consents
      }
      
      if (consents.length == 1) {
        return cb(null, true, { permissions: [ { resource: resources[0], scope: 'foo' } ]});
      }
      
      return cb(null, false, { prompt: 'consent', scope: [ 'foo', 'bar' ] }, locals);
    }
    
    function onAudienceInferred(err, audiences) {
      if (err) { return cb(err); }
      
      var resources = []
        , decisions = []
        , audience
        , i = 0;
      
      (function iter(err) {
        if (err) { return cb(err); }
      
        audience = audiences[i++];
        // TODO: Parse audience as identifier, select directory based on realm
        
        if (!audience) {
          onDecisionReached(resources, decisions);
          return;
        }
        
        resourcesDir.query(audience, function(err, resource) {
          if (err) { return iter(err); }
          // TODO: Check if !resource and handle appropriately
          
          resources.push(resource);
          pdp.eval(user, resource, client, function(err, decision, info) {
            if (err) { return iter(err); }
            
            decisions.push({ result: decision });
            return iter();
          });
        });
        
        
        /*
        services.query(audience, function(err, service) {
          if (err) { return cb(err); }
          // TODO: Return error if no service or use defaults???
        
          // TODO: Metadata about the service needed when issuing a token should be
          //       serailized for later use, as an optimization to avoid a query.
        
          var locals = {
            service: service
          }
          // TODO: Implement a way to check for already existing policies/grants
          return cb(null, false, { prompt: 'consent', scope: [ 'foo', 'bar' ] }, locals);
        });
        */
      })();
    }
    
    
    
    var iopts = {
      audience: areq.audience,
      resource: areq.resource,
      scope: areq.scope,
    };
    
    Audience.infer(iopts, onAudienceInferred);
    
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
  'http://schema.modulate.io/js/aaa/PolicyDecisionPoint',
  'http://schemas.modulate.io/js/aaa/services/Directory',
  'http://schema.modulate.io/js/aaa/audience'
];
