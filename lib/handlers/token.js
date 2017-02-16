exports = module.exports = function(server) {
  //return [ server.token(), server.errorHandler() ];
  return server.token();
};

exports['@require'] = [ 'http://schema.modulate.io/js/aaa/oauth2/Server' ];
