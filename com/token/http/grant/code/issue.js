exports = module.exports = function(sts, codes, Resources) {
  var oauth2orize = require('oauth2orize');
    
    
    // TODO: If the issued access token scope
   // is different from the one requested by the client, the authorization
   // server MUST include the "scope" response parameter to inform the
   // client of the actual scope granted.
    // see: 3.3.  Access Token Scope
    
  // TODO: Separately negotiate authentication schemes supported
  //       (much like SASL, but with Bearer, MAC, POP, OAuth, Hawk, etc)
  // NOTE: This should be explicitly in OAuth 2.0 suite, since its not needed
  //       more genericly.
    
          // TODO: Based on audience, find supported token formats, keys support etc.  For OAuth 2.0,
          //       where the auth scheme itself is negotiable, need to find supported schemes.  This is
          //       implicit in OAuth.  Also, may need to negotiate this three ways, factoring in the client
          //       itself, which may just support Bearer or not, etc.
  
  return function issueToken(client, code, redirectURI, body, authInfo, cb) {
    
    
    // TODO: Pass self trust store to token verify, using list of issuers like `ca` to Node's http
    // module
    
    //codes.decode(code, { issuer: 'sts-local' }, function(err, claims) {
    codes.decode(code, {}, function(err, claims) {
      if (err) { return cb(err); }
      
      var conf, i, len;
        
      // Verify that the authorization code was issued to the client that is
      // attempting to exchange it for an access token.
      if (client.id !== claims.client.id) {
        return cb(null, false);
      }
      
      if (claims.confirmation) {
        
        for (i = 0, len = claims.confirmation.length; i < len; ++i) {
          conf = claims.confirmation[i];
          
          switch (conf.method) {
          case 'redirect-uri':
            // Verify that the redirect URI matches the value sent in the
            // initial authorization request.
            // 
            // Refer to Section 4.1.3 of RFC 6749 for further details.
            if (redirectURI !== conf.uri) {
              return cb(new oauth2orize.TokenError('Mismatched redirect URI', 'invalid_grant'));
            }
            break;
            
          default:
            return cb(new Error('Unsupported code confirmation method: ' + conf.name));
          }
        }
      }
      
      console.log('### DS GET');
      console.log(claims);
      console.log(claims.permissions)
      
      Resources.get('userinfo', function(err, resource) {
      //Resources.get(claims.permissions[0].resource.id, function(err, resource) {
      //ds.get(claims.permissions[0].resource.id, 'resources', function(err, resource) {
        if (err) { return cb(err); }
        
        var msg = {};
        msg.user = claims.user;
        msg.client = client;
        /*
        msg.permissions = [
          { resource: resource, scope: claims.permissions[0].scope }
        ];
        */
        var audience = [ resource ];
        
        sts.issue(msg, audience, client, function(err, token, attrs) {
          // TODO: add expires_in and scope to attrs, as needed
          if (err) { return cb(err); }
          return cb(null, token, null, attrs);
        });
      }); // ds.get
      
    
      // FIXME: Put the rest of this back
      return;
      
    
      function onServiceLoaded(err, service) {
        // TODO: Load this from directory if necessary
        var grant = info.grant;
        
        var sparms = Utilization.negotiate(client.authenticationSchemes, service.authenticationSchemes)
        
        // TODO: Possibly negotiate this based on client alg support as well.
        var params = Tokens.negotiate(service.tokenTypes);
        if (!params) { return cb(new Error('Failed to negotiate token type')); }
        
        // TODO: This should be set in `info`, in milliseconds.
        // TODO: Set this to resource's default, if not less by user
        var exp = new Date();
        exp.setHours(exp.getHours() + 2);
        
        // TODO: Negotiate token type (format) as well as claims/dialect
        

        // TODO: Add a ClaimsGenerator here, which takes the user and target entity, yields
        //       claims to pass to tokenizer.  tokenParams should be an input (for JWT profile
        //       support, etc)

        // TODO: Externalize all IDs (user and client) - probably best via a decorator
        // TODO: Pass options containing sector identifier, etc.
        var claims = {
          subject: info.user.id,
          authorizedParty: client.id,
          audience: service.id,
          scope: info.permissions[0].scope,
          expiresAt: exp
        }
        if (grant) {
          claims.grant = grant.id;
        }

        // TODO: ONly add confirmation if negotiated auth scheme (Hawk, PoP, etc, requires it)
        // TODO: the key size should be based off requirements of the negotiated algorithm
        // idm.sectorize(subject, audience, function(err, id) {, etc
          /*
        var confirmation = {
          use: 'signing',
          key: rsg.generate(32)
        }
        //claims.confirmation = confirmation;
        */
        
        // TODO: Need a way to indicate that confirmation goes into a  `mac_key`
        //       in the JWT, rather than `cnf`.  This is a property of the
        //       resource server.  Such a claim only support symmetric algs (?)
      
        var type = params.type;
        delete params.type;
          
        params.peer = service;
        //params.algorithm = 'hmac-sha256';
          
      } // onServiceLoaded
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/oauth2/sts',
  'http://schemas.authnomicon.org/js/oauth2/tokens/authorization-code',
  'http://i.authnomicon.org/oauth2/ResourceDirectory'
];
