exports = module.exports = function(server) {
  return server.authorizationErrorHandler();
};

exports['@require'] = [
  'http://schema.modulate.io/js/aaa/oauth2/Server'
];
