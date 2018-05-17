exports = module.exports = function(issueTokenx, /*decode,*/ realms, Utilization, /*translate,*/ tokens, Tokens, rsg) {
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
    // FIXME: Hardcode to skip this.
    //return cb(null, 'SOME-A-TOKEN')
    
    
    // TODO: Pass self trust store to token verify, using list of issuers like `ca` to Node's http
    // module
    
    //Tokens.unseal(code, function(err, info) {
      // Rename dialect, to translate and interpret
      
      //console.log('UNSEALED CODE');
      //console.log(info);
      
      //console.log('DECIPHERING CODE');
      //console.log(code);
      
    //Tokens.decipher(code, { dialect: 'http://schemas.authnomicon.org/tokens/jwt/authorization-code' }, function(err, claims) {
    tokens.decode('urn:ietf:params:oauth:token-type:authorization_code', code, function(err, claims) {
      console.log('DECODED!');
      console.log(err);
      console.log(claims)
      
      return;
      
      
      if (err) { return cb(err); }
      
      //console.log(claims);
      //return
      
      var info = claims;
      var conf, i, len;
        
      // Verify that the authorization code was issued to the client that is
      // attempting to exchange it for an access token.
      if (client.id !== info.clientID) {
        return cb(null, false);
      }
      
      if (info.confirmation) {
        
        for (i = 0, len = info.confirmation.length; i < len; ++i) {
          conf = info.confirmation[i];
          
          console.log('CHECK THIS:');
          console.log(conf)
          console.log(redirectURI);
          
          
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
      
      
      realms.resolve('resources', function(err, realm) {
        
        var dir = realm.createDirectory(function() {
      
      dir.get(info.permissions[0].resourceID, function(err, resource) {
        console.log('ISSUE TOKEN FOR: ');
        console.log(resource);
        
        console.log('X1');
        
        var ctx = {};
        ctx.user = { id: info.userID };
        ctx.client = client;
        ctx.permissions = [ { resource: resource, scope: info.permissions[0].scope } ];
        ctx.audience = [ {
          id: 'http://localhost/userinfo'
        } ];
      
        console.log('NOW SERIALIZE THIS TO JWT ACCESS TOKEN:');
        console.log(ctx);
        
        issueTokenx(ctx, function(err, accessToken) {
          console.log('ISSUED ACCESS TOKEN!');
          console.log(err);
          console.log(accessToken);
          
          // TODO:
          var tparms = {
          };
          
          
          if (err) { return cb(err); }
          return cb(null, accessToken, null, tparms);
        });
      });
      
        }); // realm.createDirectory(readyListener)
    
        // TODO: Handle dir.on('error')??
      
      }); // realms.resolve
      
    
      // FIXME: Put the rest of this back
      return;
      
      if (err) { return cb(err); }
      // TODO: if(!info)
    
      if (typeof info.user == 'string') {
        info.user = { id: info.user };
      }
      if (typeof info.client == 'string') {
        info.client = { id: info.client };
      }
      
      if (client.id !== info.client.id) {
        // Verify that the authorization code was issued to the client that is
        // attempting to exchange it.
        return cb(null, false);
      }
      
      if (info.redirectURI !== redirectURI) {
        // Verify that the redirect URI matches the value sent in the initial
        // authorization request.
        // 
        // Refer to Section 4.1.3 of RFC 6749 for further details.
        return cb(new oauth2orize.TokenError('Mismatched redirect URI', 'invalid_grant'));
      }
      
    
      function onServiceLoaded(err, service) {
        if (err) { return cb(err); }
        
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
        
        console.log('ENCODE THESE CLAIMS!');
        console.log(type);
        console.log(claims);
        console.log(params);
        console.log('--');
        
        
        var ctx = {};
        ctx.user = info.user;
        ctx.client = client;
        ctx.resources = [ service ];
        
        translate(ctx, function(err, claims) {
          if (err) { return cb(err); }
          
          Tokens.encode(type, claims, params, function(err, token) {
            if (err) { return cb(err); }
            // TODO: offline access, params with scope and expires in
          
            var tparms = {
              token_type: sparms.type
            };
            
            console.log('ENCODED TOKEN!');
            console.log(token);
            
            return cb(null, token, null, tparms);
            //return cb(null, token, confirmation.key);
          });
          
          
        });
      } // onServiceLoaded
    
      // TODO: This directory query can be optimized way if things are serialized into
      //       th requestToken
      services.get(info.permissions[0].resource, onServiceLoaded);
    });
  };
};


exports['@require'] = [
  '../../../../util/issuetoken',
  /*'http://schemas.modulate.io/js/aaa/oauth2/code/dialect/jwt/decode',*/
  'http://schemas.modulate.io/js/aaa/realms',
  'http://schema.modulate.io/js/aaa/schemes',
  //'http://i.bixbyjs.org/tokens/dialects/jwt/translate',
  'http://i.bixbyjs.org/security/tokens',
  'http://i.bixbyjs.org/tokens',
  // TODO: Collaps this into the facade that combines Encoder and Negotiator
  //'http://i.bixbyjs.org/tokens/Negotiator',
  'http://i.bixbyjs.org/crypto/RSG'
];
