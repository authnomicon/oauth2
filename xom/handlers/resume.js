exports = module.exports = function(server, immediateResponseCb) {
  return server.resume(
    immediateResponseCb
  );
};

exports['@require'] = [
  'http://schema.modulate.io/js/aaa/oauth2/Server',
  './authorize/immediateresponsecb'
];
