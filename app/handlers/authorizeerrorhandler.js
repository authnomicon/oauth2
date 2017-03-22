exports = module.exports = function(server) {
  return server.authorizationErrorHandler();
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server'
];
