// Module dependencies.
var oauth2orize = require('oauth2orize')
  , merge = require('utils-merge');

exports = module.exports = function(acs, logger, C) {
  
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
          
          component.create()
            .then(function(responder) {
              logger.info("Loaded response mode '" + mode +  "' for OAuth 2.0 authorization code grant");
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
      var extensions = [];
      
      return new Promise(function(resolve, reject) {
        var components = C.components('module:oauth2orize.responseParametersFn');
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve([ responders, extensions ]);
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
              iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(plugins) {
      var responders = plugins[0];
      var extensions = plugins[1];
      
      return oauth2orize.grant.code({
        modes: responders
      }, function(client, redirectURI, user, ares, areq, locals, cb) {
        var msg = {};
        // TODO: Eliminate this or move this to locals?
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
          
          extension(txn, iter);
        })();
      });
    });
};

exports['@implements'] = 'module:oauth2orize.RequestProcessor';
exports['@type'] = 'code';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/AuthorizationCodeService',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
