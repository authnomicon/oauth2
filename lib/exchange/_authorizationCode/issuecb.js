exports = module.exports = function(acs, services, Tokens, TokensNegotiator, rsg) {
    
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
    acs.load(code, function(err, info) {
      if (err) { return cb(err); }
    
      if (typeof info.user == 'string') {
        info.user = { id: info.user };
      }
      if (typeof info.client == 'string') {
        info.client = { id: info.client };
      }
      
      if (client.id !== info.client.id) { return cb(null, false); }
    
      function onServiceLoaded(err, service) {
        if (err) { return cb(err); }
        
        // TODO: Load this from directory if necessary
        var grant = info.grant;
        
        // TODO: Possibly negotiate this based on client alg support as well.
        var params = TokensNegotiator.negotiate(service.tokenTypes);
        if (!params) { return cb(new Error('Failed to negotiate token type')); }
        
        // TODO: This should be set in `info`, in milliseconds.
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() + 30);

        // TODO: Externalize all IDs (user and client) - probably best via a decorator
        // TODO: Pass options containing sector identifier, etc.
        var claims = {
          subject: info.user.id,
          authorizedParty: client.id,
          audience: service.id,
          scope: info.scope,
          expiresAt: exp
        }
        if (grant) {
          claims.grant = grant.id;
        }

        // TODO: ONly add confirmation if negotiated auth scheme (Hawk, PoP, etc, requires it)
        // TODO: the key size should be based off requirements of the negotiated algorithm
        // idm.sectorize(subject, audience, function(err, id) {, etc
        var confirmation = {
          use: 'signing',
          key: rsg.generate(32)
        }
        //claims.confirmation = confirmation;
        
        // TODO: Need a way to indicate that confirmation goes into a  `mac_key`
        //       in the JWT, rather than `cnf`.  This is a property of the
        //       resource server.  Such a claim only support symmetric algs (?)
      
        params.peer = service;
        Tokens.encode(params.type, claims, params, function(err, token) {
          if (err) { return cb(err); }
          return cb(null, token, confirmation.key);
        });
      } // onServiceLoaded
    
      // TODO: This directory query can be optimized way if things are serialized into
      //       th requestToken
      services.query(info.service, onServiceLoaded);
    });
  };
};


exports['@require'] = [
  'http://schemas.modulate.io/js/aaa/oauth2/ACS',
  'http://schemas.modulate.io/js/aaa/services/Directory',
  'http://i.bixbyjs.org/tokens/Encoder',
  // TODO: Collaps this into the facade that combines Encoder and Negotiator
  'http://i.bixbyjs.org/tokens/Negotiator',
  'http://i.bixbyjs.org/crypto/RSG'
];
