exports = module.exports = function(ats, acs) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(function(client, code, redirectURI, body, authInfo, cb) {
    // TODO: Pass self trust store to token verify, using list of issuers like `ca` to Node's http
    // module
    
    acs.verify(code, function(err, claims) {
      if (err) { return cb(err); }
      
      var conf, i, len;
        
      // Verify that the authorization code was issued to the client that is
      // attempting to exchange it for an access token.
      if (client.id !== claims.client.id) {
        return cb(null, false);
      }
      
      // TODO: Simplify this so claims just contains redirect_uri directly
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
      
      if (err) { return cb(err); }
      
      var msg = {};
      msg.user = claims.user;
      msg.client = client;
      /*
      msg.permissions = [
        { resource: resource, scope: claims.permissions[0].scope }
      ];
      */
      //var audience = [ resource ];
      var audience = [];
      
      ats.issue(msg, function(err, token) {
        if (err) { return cb(err); }
        return cb(null, token);
      });
    });
  });
}

exports['@implements'] = 'http://i.authnomicon.org/oauth2/token/http/AuthorizationGrantExchange';
exports['@type'] = 'authorization_code';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/AccessTokenService',
  'http://i.authnomicon.org/oauth2/AuthorizationCodeService'
];
