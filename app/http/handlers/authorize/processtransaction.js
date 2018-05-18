exports = module.exports = function(resources, aaa) {
  var oauth2orize = require('oauth2orize');
  
  
  return function processTransaction(client, user, scope, type, areq, locals, cb) {
    locals = locals || {};
    
    function proceed(err, resource) {
      if (err) { return cb(err); }
    
      var options = {
        client: client,
        user: user,
        resource: resource
      };
    
      var dreq = aaa.request(options, function(dec) {
      
        function ondecision(result) {
          if (result === true) {
            if (!locals.consent) {
              return cb(null, false, { prompt: 'consent'});
            }
          
            var resource = { id: 'http://www.example.com/',
             name: 'Example Service',
             tokenTypes: 
              [ { type: 'application/fe26.2' },
                { type: 'urn:ietf:params:oauth:token-type:jwt',
                  secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd' } ] }
        
            //res.resources = [ resource ]
            // TODO: Get res.resources here
        
            return cb(null, true, { permissions: [ { resource: resource, scope: [ 'foo' ] } ]});
          } else {
            return cb(null, false);
          }
        
          // TODO: Handle indeterminte by prompting?  Or attenuating scope?
        }
      
        function onprompt(name, options) {
          var opts = options || {};
          opts.prompt = name;
          return cb(null, false, opts);
        }
      
        function onend() {
          dec.removeListener('decision', ondecision);
          dec.removeListener('prompt', onprompt);
        }
      
        dec.once('decision', ondecision);
        dec.once('prompt', onprompt);
        dec.once('end', onend);
      });
    
      dreq.on('error', function(err) {
        // TODO:
      })
    
      dreq.send();
    }
    
    
    proceed(areq.audience);
    
    return;
    
    
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
    
    // TODO: Parse audience as identifier, select directory based on realm
    
          // TODO: Return error if no service or use defaults???
        
          // TODO: Metadata about the service needed when issuing a token should be
          //       serailized for later use, as an optimization to avoid a query.
    
    // TODO: Implement a way to check for already existing policies/grants
    
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
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/authorize/processTransactionFunc';
exports['@require'] = [
  'http://schemas.authnomicon.org/js/oauth2/resources',
  'http://schemas.authnomicon.org/js/aaa'
];
