exports = module.exports = function(ats, acs, logger, C) {
  var oauth2orize = require('oauth2orize')
    , merge = require('utils-merge');
  
  
  return Promise.resolve(null)
    .then(function() {
      var extensions = [];
      
      return new Promise(function(resolve, reject) {
        var components = C.components('module:@authnomicon/oauth2.tokenResponseParametersFn');
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(extensions);
          }
          
          component.create()
            .then(function(extension) {
              logger.info('Loaded response parameter extension: ');
              extensions.push(extension);
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load response parameter extension:\n';
              msg += err.stack;
              logger.warning(msg);
              return iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(extensions) {
      
      return oauth2orize.exchange.code(function(client, code, redirectURI, body, authInfo, cb) {
        // TODO: Pass self trust store to token verify, using list of issuers like `ca` to Node's http
        // module

        acs.verify(code, function(err, cmsg) {
          if (err) { return cb(err); }
          
          // Verify that the authorization code was issued to the client that is
          // attempting to exchange it for an access token.
          if (client.id !== cmsg.client.id) {
            return cb(null, false);
          }
          
          // Verify that the redirect URI matches the value sent in the
          // initial authorization request.
          //
          // Refer to Section 4.1.3 of RFC 6749 for further details.
          if (redirectURI !== cmsg.redirectURI) {
            return cb(new oauth2orize.TokenError('Mismatched redirect URI', 'invalid_grant'));
          }
  
          var msg = {};
          if (cmsg.issuer) { msg.issuer = cmsg.issuer; }
          msg.user = cmsg.user;
          msg.client = client;
          if (cmsg.scope) { msg.scope = cmsg.scope; }
          if (cmsg.authContext) { msg.authContext = cmsg.authContext; }
          
          ats.issue(msg, function(err, token) {
            if (err) { return cb(err); }
            
            var bind = { accessToken: token };
            var params = {};
            var i = 0;
            
            (function iter(err, exparams) {
              if (err) { return cb(err); }
              if (exparams) { merge(params, exparams); }
          
              var extension = extensions[i++];
              if (!extension) {
                return cb(null, token, null, params);
              }
          
              var arity = extension.length;
              if (arity == 4) {
                // TODO: Eliminate the grant argument here, and make it an annotation.
                extension(msg, bind, 'authorization_code', iter);
              } else if (arity == 3) {
                extension(msg, bind, iter);
              } else {
                extension(msg, iter);
              }
            })();
          });
        });
      });
      
    });
}

exports['@implements'] = 'module:oauth2orize.tokenRequestHandler';
exports['@type'] = 'authorization_code';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/AccessTokenService',
  'http://i.authnomicon.org/oauth2/AuthorizationCodeService',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
