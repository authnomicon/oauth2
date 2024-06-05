exports = module.exports = function(ats, acs, logger, C) {
  var oauth2orize = require('oauth2orize')
    , merge = require('utils-merge');
  
  
  return Promise.resolve(null)
    .then(function() {
      var paramsExtFns = [];
      
      return new Promise(function(resolve, reject) {
        // TODO: These need to be ordered for native SSO device secret to bind
        // id_token.   Bixby might be doing this already???
        var components = C.components('module:@authnomicon/oauth2.tokenResponseParametersFn;grant_type=code');
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(paramsExtFns);
          }
          
          component.create()
            .then(function(extFn) {
              logger.info('Loaded response parameter extension: ');
              paramsExtFns.push(extFn);
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load response parameter extension:\n';
              msg += err.stack;
              logger.warning(msg);
              iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(paramsExtFns) {
      
      return oauth2orize.exchange.code(function(client, code, redirectURI, body, authInfo, cb) {
        // TODO: Pass self trust store to token verify, using list of issuers like `ca` to Node's http
        // module

        acs.verify(code, function(err, cmsg) {
          if (err) { return cb(err); }
          // TODO: handle case where cmsg is false
          
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
  
          var msg = cmsg;
          msg.client = client;
          
          ats.issue(msg, function(err, token) {
            if (err) { return cb(err); }
            
            var bind = { accessToken: token };
            var params = {};
            var i = 0;
            
            (function iter(err, xparams, xbound) {
              if (err) { return cb(err); }
              if (xparams) { merge(params, xparams); }
              if (xbound) { merge(bind, xbound); }
          
              var extFn = paramsExtFns[i++];
              if (!extFn) {
                return cb(null, token, null, params);
              }
          
              var arity = extFn.length;
              if (arity == 3) {
                extFn(msg, bind, iter);
              } else {
                extFn(msg, iter);
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
  'module:@authnomicon/oauth2.AccessTokenService',
  'module:@authnomicon/oauth2.AuthorizationCodeService',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
