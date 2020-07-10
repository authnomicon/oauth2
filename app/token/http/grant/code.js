exports = module.exports = function(sts) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(function(client, code, redirectURI, body, authInfo, cb) {
    console.log('EXCHANGE!');
    console.log(client);
    console.log(code);
    console.log(redirectURI);
    console.log(body);
    console.log(authInfo);
    
    // TODO: Pass self trust store to token verify, using list of issuers like `ca` to Node's http
    // module
    
    //codes.decode(code, { issuer: 'sts-local' }, function(err, claims) {
    //sts2.decode(code, {}, function(err, claims) {
    sts.verify(code, 'authorization_code', function(err, claims) {
      console.log('DECODED CODE!');
      console.log(err);
      console.log(claims);
      //return;
      
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
      
      //Resources.get('userinfo', function(err, resource) {
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
        //var audience = [ resource ];
        var audience = [];
        
        sts.issue(msg, 'access_token', function(err, token) {
          console.log('ISSUED ACCESS TOKEN');
          console.log(err);
          console.log(token);
          
          if (err) { return cb(err); }
          return cb(null, token);
        });
        
        /*
        sts.issue(msg, audience, client, function(err, token, attrs) {
          // TODO: add expires_in and scope to attrs, as needed
          if (err) { return cb(err); }
          return cb(null, token, null, attrs);
        });
        */
      //}); // ds.get
      
    
      // FIXME: Put the rest of this back
    });
  });
}

exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/Exchange';
exports['@type'] = 'authorization_code';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/SecurityTokenService',
];
