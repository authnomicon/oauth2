// Module dependencies.
var oauth2orize = require('oauth2orize');

exports = module.exports = function(ats, logger, C) {
  
  return Promise.resolve(null)
    .then(function() {
      var responders = {};
    
      return new Promise(function(resolve, reject) {
        var components = C.components('module:oauth2orize.Responder')
          , mode;
    
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(responders);
          }
        
          mode = component.a['@mode'];
          if (mode == 'query') {
            // The default response mode of this response type is the fragment
            // encoding.  In accordance with security considerations, this
            // response type must not use query encoding, in order to avoid
            // leaking sensitive information such as access tokens.
            //
            // For more information, refer to:
            // https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#Security
            return iter(i + 1);
          }
        
          component.create()
            .then(function(responder) {
              logger.info("Loaded response mode '" + mode +  "' for OAuth 2.0 implicit grant");
              responders[mode] = responder;
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load response mode for OAuth 2.0 authorization code grant:\n';
              msg += err.stack;
              logger.warning(msg);
              iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(responders) {
      // TODO: Load response parameter extension plugins
      
      return [ responders ];
    })
    .then(function(plugins) {
      var responders = plugins[0];
      
      return oauth2orize.grant.token({
        modes: responders
      }, function(client, user, ares, areq, locals, cb) {
        var msg = ares;
        msg.client = client;
        msg.user = user;
        // TODO: Put a grant ID in here somehere
        // maybe not, since there's no refresh token here?
        //msg.grant = ares;
        // TODO: Pass some indicator that this is an implicit flow, so token lifetimes
        //. can be constrained accordingly
        
        ats.issue(msg, function(err, token) {
          if (err) { return cb(err); }
          return cb(null, token);
        });
      });
    });
};

exports['@implements'] = 'module:oauth2orize.RequestProcessor';
exports['@type'] = 'token';
exports['@require'] = [
  'module:@authnomicon/oauth2.AccessTokenService',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
