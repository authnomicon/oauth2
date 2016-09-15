exports = module.exports = function(container, serializeClientCb, deserializeClientCb, logger) {
  var oauth2orize = require('oauth2orize');
  
  var server = oauth2orize.createServer();
  
  server.grant(require('oauth2orize-response-mode').extensions());
  server.grant(require('oauth2orize-wmrm').extensions());
  
  // WIP: https://tools.ietf.org/html/rfc6749
  //      @ 4.1.  Authorization Code Grant
  
  
  var specs = container.specs()
    , spec, plugin, i, len;
  for (i = 0, len = specs.length; i < len; ++i) {
    spec = specs[i];
    
    if ((spec.implements || []).indexOf('http://schemas.modulate.io/js/aaa/oauth2/Response') !== -1) {
      // This specification declares an OAuth 2.0 authorization response type.
      // Create the type and plug it in to the oauth2orize `Server` instance.
      plugin = container.create(spec.id);
      server.grant(spec.a['@type'] || plugin.name, plugin);
      logger.info('Registered OAuth 2.0 response type: ' + (spec.a['@type'] || plugin.name));
    }
    
    if ((spec.implements || []).indexOf('http://schemas.modulate.io/js/aaa/oauth2/exchange') !== -1) {
      // This specification declares an OAuth 2.0 token exchange.  Create the
      // exchange and plug it in to the oauth2orize `Server` instance.
      plugin = container.create(spec.id);
      server.exchange(spec.a['@type'] || plugin.name, plugin);
      logger.info('Registered OAuth 2.0 exchange type: ' + (spec.a['@type'] || plugin.name));
    }
  }
  
  
  // TODO: When implementing refresh_token exchange, need an ack'ing strategy
  //       if we choose to rotate the refresh_token itself, otherwise the client
  //       and server could get out of sync.  (See 1.5 (H) of OAuth 2.0 RFC)
  
  
  
  // TODO: Consider the impact of non-session-based transactions stores on
  //       client serialization.
  server.serializeClient(serializeClientCb);
  server.deserializeClient(deserializeClientCb);
  
  return server;
}

exports['@singleton'] = true;
// TODO: Refactor state handling to a plugin system.
exports['@require'] = [ '!container',
                        './state/serializeclientcb',
                        './state/deserializeclientcb',
                        'http://i.bixbyjs.org/Logger' ];
exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/Server';
