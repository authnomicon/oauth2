exports = module.exports = function(container, issue, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  // TODO: require('oauth2orize-idpiframerm')
  
  var components = container.components('http://schemas.authnomicon.org/js/http/oauth2/ResponseMode');
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
      }, issue);
    });
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/Grant';
exports['@type'] = 'token';
exports['@require'] = [
  '!container',
  './issue',
  'http://i.bixbyjs.org/Logger'
];
