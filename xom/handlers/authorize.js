exports = module.exports = function(server, validateRequestCb, immediateResponseCb) {
  return server.authorization(
    validateRequestCb,
    immediateResponseCb
  );
};

exports['@require'] = [
  'http://schema.modulate.io/js/aaa/oauth2/Server',
  './authorize/validaterequestcb',
  './authorize/immediateresponsecb'
];
