exports = module.exports = function(container, acs, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var components = container.components('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode');
  return Promise.all(components.map(function(comp) { return comp.create(); } ))
    .then(function(plugins) {
      var modes = {}
        , name;
      plugins.forEach(function(mode, i) {
        name = components[i].a['@mode'];
        modes[name] = mode;
        logger.info('Loaded response mode for OAuth 2.0 authorization code grant: ' + name);
      });
      
      return oauth2orize.grant.code({
        modes: modes
      }, function(client, redirectURI, user, ares, areq, locals, cb) {
        var ctx = {};
        ctx.client = client;
        ctx.redirectURI = redirectURI;
        ctx.user = user;
        ctx.grant = ares;
        
        acs.issue(ctx, function(err, code) {
          if (err) { return cb(err); }
          return cb(null, code);
        });
      });
    });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseType';
exports['@type'] = 'code';
exports['@require'] = [
  '!container',
  'http://i.authnomicon.org/oauth2/AuthorizationCodeService',
  'http://i.bixbyjs.org/Logger'
];
