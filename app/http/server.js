exports = module.exports = function(container, store, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var server = oauth2orize.createServer({
    store: store
  });
  
  return Promise.resolve(server)
    .then(function(server) {
      // Register request parameter extensions with the OAuth 2.0 server.
      var paramDecls = container.components('http://i.authnomicon.org/oauth2/http/request/Parameters');
    
      return Promise.all(paramDecls.map(function(spec) { return container.create(spec.id); } ))
        .then(function(plugins) {
          plugins.forEach(function(plugin, i) {
            server.grant(plugin);
            logger.info('Loaded OAuth 2.0 request parameters: ' + paramDecls[i].id);
          });
        })
        .then(function() {
          return server;
        });
    })
    .then(function(server) {
      // Register response types with the OAuth 2.0 server.
      var typeComps = container.components('http://i.authnomicon.org/oauth2/http/Response')
    
      return Promise.all(typeComps.map(function(spec) { return container.create(spec.id); } ))
        .then(function(plugins) {
          plugins.forEach(function(plugin, i) {
            server.grant(typeComps[i].a['@type'] || plugin.name, plugin);
            logger.info('Loaded OAuth 2.0 response type: ' + (typeComps[i].a['@type'] || plugin.name));
          });
        })
        .then(function() {
          return server;
        });
    })
    .then(function(server) {
      // Register grant types with the OAuth 2.0 server.
      
      return new Promise(function(resolve, reject) {
        var components = container.components('http://i.authnomicon.org/oauth2/http/Exchange');
        
        (function iter(i) {
          var component = components[i]
            , type;
          if (!component) {
            return resolve(server);
          }
          
          type = component.a['@type'];
          
          component.create()
            .then(function(exchange) {
              logger.info('Loaded OAuth 2.0 grant exchange: ' + (type || exchange.name));
              server.exchange(type || exchange.name, exchange);
              iter(i + 1);
            }, function(err) {
              // TODO: Print the package name in the error, so it can be found
              // TODO: Make the error have the stack of dependencies.
              if (err.code == 'IMPLEMENTATION_NOT_FOUND') {
                // TODO: Mount debugging middleware here
                
                logger.notice(err.message + ' while loading component ' + component.id);
                return iter(i + 1);
              }
              
              reject(err);
            })
        })(0);
      });
    })
    .then(function(server) {
      return server;
    });
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/Server';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  './transactionstore',
  'http://i.bixbyjs.org/Logger'
];
