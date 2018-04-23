exports = module.exports = function(container, store, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var server = oauth2orize.createServer({
    store: store
  });
  
  return Promise.resolve(server)
    .then(function(server) {
      // Register request parameter extensions with the OAuth 2.0 server.
      var paramDecls = container.components('http://schemas.authnomicon.org/js/aaa/oauth2/request/parameters');
    
      return Promise.all(paramDecls.map(function(spec) { return container.create(spec.id); } ))
        .then(function(plugins) {
          plugins.forEach(function(plugin, i) {
            server.grant(plugin);
            logger.info('Loaded OAuth 2.0 request parameters: ' + paramDecls[i].a['@name']);
          });
        })
        .then(function() {
          return server;
        });
    })
    .then(function(server) {
      // Register response types with the OAuth 2.0 server.
      var typeComps = container.components('http://schemas.authnomicon.org/js/oauth2/responseType')
    
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
      var typeComps = container.components('http://schemas.authnomicon.org/js/http/oauth2/Exchange')
    
      return Promise.all(typeComps.map(function(spec) { return container.create(spec.id); } ))
        .then(function(plugins) {
          plugins.forEach(function(plugin, i) {
            server.exchange(typeComps[i].a['@type'] || plugin.name, plugin);
            logger.info('Loaded OAuth 2.0 grant type: ' + (typeComps[i].a['@type'] || plugin.name));
          });
        })
        .then(function() {
          return server;
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
