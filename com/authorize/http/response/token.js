exports = module.exports = function(container, ats, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  // TODO: require('oauth2orize-idpiframerm')
  
  var components = container.components('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode');
  return Promise.all(components.map(function(comp) { return comp.create(); } ))
    .then(function(plugins) {
      var modes = {}
        , name;
      plugins.forEach(function(mode, i) {
        name = components[i].a['@mode'];
        if (name == 'query') {
          // The default response mode of this response type is the fragment
          // encoding.  In accordance with security considerations, this
          // response type must not use query encoding, in order to avoid
          // leaking sensitive information such as access tokens.
          //
          // For more information, refer to:
          // https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#Security
          return;
        }
        
        modes[name] = mode;
        logger.info('Loaded response mode for OAuth 2.0 implicit grant: ' + name);
      });
      
      return oauth2orize.grant.token({
        modes: modes
      }, function(client, user, ares, areq, locals, cb) {
        var msg = {};
        msg.client = client;
        msg.user = user;
        msg.grant = ares;
        // TODO: Pass some indicator that this is an implicit flow, so token lifetimes
        //. can be constrained accordingly
        
        ats.issue(msg, function(err, token) {
          if (err) { return cb(err); }
          return cb(null, token);
        });
      });
    });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseType';
exports['@type'] = 'token';
exports['@require'] = [
  '!container',
  'http://i.authnomicon.org/oauth2/AccessTokenService',
  'http://i.bixbyjs.org/Logger'
];
