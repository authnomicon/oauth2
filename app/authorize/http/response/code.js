exports = module.exports = function(container, sts, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var components = container.components('http://i.authnomicon.org/oauth2/authorize/http/ResponseMode');
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
    
        if (ares.scope) {
          ctx.scope = ares.scope;
        }
        // TODO: (multiple) resource-specific permissions
        //ctx.permissions = ares.permissions;
    
        var opt = {};
        //opt.type = 'application/fe26.2';
        //opt.type = 'application/x-fernet-json';
        opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/authorization-code';
        opt.audience = [ {
          id: 'AS1AC',
          identifier: 'http://localhost/authorization_code',
          secret: 'some-secret-shared-with-oauth-authorization-server'
        } ];
    
        // TODO: Ensure that code has a TTL of 10 minutes

        var opts = {}
        opts.confidential = false;
    
        sts.issue(ctx, 'authorization_code', function(err, code) {
          if (err) { return cb(err); }
          return cb(null, code);
        });
      });
    });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/Response';
exports['@type'] = 'code';
exports['@require'] = [
  '!container',
  'http://i.authnomicon.org/oauth2/SecurityTokenService',
  'http://i.bixbyjs.org/Logger'
];
