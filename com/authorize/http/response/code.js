exports = module.exports = function(acs, logger, C) {
  var oauth2orize = require('oauth2orize')
    , merge = require('utils-merge');
  
  
  return Promise.resolve(null)
    .then(function() {
      var extensions = [];
      
      return new Promise(function(resolve, reject) {
        var components = C.components('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters');
      
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
  
      var components = C.components('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode');
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
            var msg = {};
            if (ares.issuer) { msg.issuer = ares.issuer; }
            msg.client = client;
            msg.redirectURI = redirectURI;
            msg.user = user;
            // TODO: Put a grant ID in here somehere
            //msg.grant = ares;
            if (ares.scope) { msg.scope = ares.scope; }
            if (ares.authContext) { msg.authContext = ares.authContext; }
        
            acs.issue(msg, function(err, code) {
              if (err) { return cb(err); }
              return cb(null, code);
            });
          }, function(txn, cb) {
            var params = {};
            var i = 0;
            
            (function iter(err, exparams) {
              if (err) { return cb(err); }
              if (exparams) { merge(params, exparams); }
          
              var extension = extensions[i++];
              if (!extension) {
                return cb(null, params);
              }
          
              var arity = extension.length;
              extension(txn, iter);
            })();
          });
        });
    });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseType';
exports['@type'] = 'code';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/AuthorizationCodeService',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
