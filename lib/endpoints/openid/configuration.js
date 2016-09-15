exports = module.exports = function(server) {
  
  // TODO: Move this to openid/configuration
  var config = {
    //response_types_supported: server.responseTypesSupported(),
    // TODO: response_modes_supported
    grant_types_supported: [] //server.grantTypesSupported(),
    // TODO: token_endpoint_auth_methods_supported
  };
  
  
  
  
  function respond(req, res) {
    res.json(config);
  }
  
  // curl http://127.0.0.1:8080/.well-known/openid-configuration
  return [ respond ];
};


exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/oauth2/Server' ];

exports['@implements'] = 'http://i.expressjs.com/endpoint';
