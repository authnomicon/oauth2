exports = module.exports = function(container, store, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var server = oauth2orize.createServer({
    store: store
  });
  
  var paramDecls = container.specs('http://schemas.authnomicon.org/js/aaa/oauth2/request/parameters')
    , grantDecls = container.specs('http://schemas.authnomicon.org/js/aaa/oauth2/grant')
    , exchangeDecls = container.specs('http://schemas.authnomicon.org/js/aaa/oauth2/exchange')
  
  return Promise.all(paramDecls.map(function(spec) { return container.create(spec.id); } ))
    .then(function(plugins) {
      // Register request parameter extensions with the OAuth 2.0 server.
      plugins.forEach(function(plugin, i) {
        server.grant(plugin);
        logger.info('Loaded OAuth 2.0 request parameters: ' + paramDecls[i].a['@name']);
      });
    })
    .then(function() {
      return Promise.all(grantDecls.map(function(spec) { return container.create(spec.id); } ));
    })
    .then(function(plugins) {
      // Register response types with the OAuth 2.0 server.
      plugins.forEach(function(plugin, i) {
        server.grant(grantDecls[i].a['@type'] || plugin.name, plugin);
        logger.info('Loaded OAuth 2.0 response type: ' + (grantDecls[i].a['@type'] || plugin.name));
      });
    })
    .then(function() {
      return Promise.all(exchangeDecls.map(function(spec) { return container.create(spec.id); } ));
    })
    .then(function(plugins) {
      // Register grant types with the OAuth 2.0 server.
      plugins.forEach(function(plugin, i) {
        server.exchange(exchangeDecls[i].a['@type'] || plugin.name, plugin);
        logger.info('Loaded OAuth 2.0 grant type: ' + (exchangeDecls[i].a['@type'] || plugin.name));
      });
    })
    .then(function() {
      return server;
    });
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/Server';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://schemas.authnomicon.org/js/aaa/oauth2/TransactionStore',
  'http://i.bixbyjs.org/Logger'
];
