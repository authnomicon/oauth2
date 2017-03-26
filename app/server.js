exports = module.exports = function(container, store, logger) {
  var oauth2orize = require('oauth2orize');
  
  var server = oauth2orize.createServer({
    store: store
  });
  
  server.grant(require('oauth2orize-response-mode').extensions());
  server.grant(require('oauth2orize-wmrm').extensions());
  server.grant(require('oauth2orize-openid').extensions());
  
  
  var responseDecls = container.specs('http://schemas.authnomicon.org/js/aaa/oauth2/response')
    , grantDecls = container.specs('http://schemas.authnomicon.org/js/aaa/oauth2/grant')
  
  return Promise.all(responseDecls.map(function(spec) { return container.create(spec.id); } ))
    .then(function(plugins) {
      // Register response types with the OAuth 2.0 server.
      plugins.forEach(function(plugin, i) {
        server.grant(responseDecls[i].a['@type'] || plugin.name, plugin);
        logger.info('Loaded OAuth 2.0 response type: ' + (responseDecls[i].a['@type'] || plugin.name));
      });
    })
    .then(function() {
      return Promise.all(grantDecls.map(function(spec) { return container.create(spec.id); } ));
    })
    .then(function(plugins) {
      // Register grant types with the OAuth 2.0 server.
      plugins.forEach(function(plugin, i) {
        server.exchange(grantDecls[i].a['@type'] || plugin.name, plugin);
        logger.info('Loaded OAuth 2.0 grant type: ' + (grantDecls[i].a['@type'] || plugin.name));
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
