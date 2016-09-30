exports = module.exports = function(acs, services, Schemes, Tokens, rsg) {
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
  
  return function issueCode(client, code, redirectURI, cb) {
    acs.get(code, function(err, info) {
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
        
        var sparms = Schemes.negotiate(client.authenticationSchemes, service.authenticationSchemes)
        
        // TODO: Possibly negotiate this based on client alg support as well.
        var params = Tokens.negotiate(service.tokenTypes);
        if (!params) { return cb(new Error('Failed to negotiate token type')); }
        
        // TODO: This should be set in `info`, in milliseconds.
        // TODO: Set this to resource's default, if not less by user
        var exp = new Date();
        exp.setHours(exp.getHours() + 2);

        // TODO: Externalize all IDs (user and client) - probably best via a decorator
        // TODO: Pass options containing sector identifier, etc.
        var claims = {
          subject: info.user.id,
          authorizedParty: client.id,
          audience: service.id,
          scope: info.access[0].scope,
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
        
        Tokens.encode(type, claims, params, function(err, token) {
          if (err) { return cb(err); }
          // TODO: offline access, params with scope and expires in
          
          var tparms = {
            token_type: sparms.type
          };
          return cb(null, token, null, tparms);
          //return cb(null, token, confirmation.key);
        });
      } // onServiceLoaded
    
      // TODO: This directory query can be optimized way if things are serialized into
      //       th requestToken
      services.get(info.access[0].resource, onServiceLoaded);
    });
  };
};


exports['@require'] = [
  'http://schemas.modulate.io/js/aaa/oauth2/ACS',
  'http://schemas.modulate.io/js/aaa/services/Directory',
  'http://schema.modulate.io/js/aaa/schemes',
  'http://i.bixbyjs.org/tokens/Encoder',
  'http://i.bixbyjs.org/tokens/Encoder',
  // TODO: Collaps this into the facade that combines Encoder and Negotiator
  //'http://i.bixbyjs.org/tokens/Negotiator',
  'http://i.bixbyjs.org/crypto/RSG'
];
