exports = module.exports = function(container, store, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var server = oauth2orize.createServer({
    store: store
  });
  
  return Promise.resolve(server)
    .then(function(server) {
      // Register request parameter extensions with the OAuth 2.0 server.
      return new Promise(function(resolve, reject) {
        var components = container.components('http://i.authnomicon.org/oauth2/authorization/http/RequestParameters');
        
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(server);
          }
          
          component.create()
            .then(function(requestParams) {
              logger.info('Loaded OAuth 2.0 authorization request parameters: ' + component.id);
              server.grant(requestParams);
              iter(i + 1);
            }, function(err) {
              // TODO: Print the package name in the error, so it can be found
              // TODO: Make the error have the stack of dependencies.
              if (err.code == 'IMPLEMENTATION_NOT_FOUND') {
                logger.notice(err.message + ' while loading component ' + component.id);
                // TODO: Mount an implementation not found indicator in development
                return iter(i + 1);
              }
              
              reject(err);
            });
        })(0);
      });
    })
    .then(function(server) {
      // Register response types with the OAuth 2.0 server.
      return new Promise(function(resolve, reject) {
        var components = container.components('http://i.authnomicon.org/oauth2/authorization/http/ResponseType');
        
        (function iter(i) {
          var component = components[i]
            , type;
          if (!component) {
            return resolve(server);
          }
          
          type = component.a['@type'];
          
          component.create()
            .then(function(responseType) {
              logger.info('Loaded OAuth 2.0 authorization response type: ' + (type || responseType.name));
              server.grant(type || responseType.name, responseType);
              iter(i + 1);
            }, function(err) {
              // TODO: Print the package name in the error, so it can be found
              // TODO: Make the error have the stack of dependencies.
              if (err.code == 'IMPLEMENTATION_NOT_FOUND') {
                logger.notice(err.message + ' while loading component ' + component.id);
                // TODO: Mount an implementation not found indicator in development
                return iter(i + 1);
              }
              
              reject(err);
            });
        })(0);
      });
    })
    .then(function(server) {
      // Register grant types with the OAuth 2.0 server.
      return new Promise(function(resolve, reject) {
        var components = container.components('http://i.authnomicon.org/oauth2/token/http/GrantType');
        
        (function iter(i) {
          var component = components[i]
            , type;
          if (!component) {
            return resolve(server);
          }
          
          type = component.a['@type'];
          
          component.create()
            .then(function(exchange) {
              logger.info('Loaded OAuth 2.0 authorization grant exchange: ' + (type || exchange.name));
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

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  './transactionstore',
  'http://i.bixbyjs.org/Logger'
];
