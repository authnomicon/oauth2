exports = module.exports = function(server, validateRequestCb, immediateResponseCb) {
  return server.authorization(
    validateRequestCb,
    immediateResponseCb
  );
};


exports['@require'] = [
  'http://schemas.modulate.io/js/aaa/oauth2/Server',
  './_authorize/validaterequestcb',
  './_authorize/immediateresponsecb'
];

exports['@implements'] = [
  'http://i.expressjs.com/endpoint',
  'http://schemas.modulate.io/js/aaa/oauth2/endpoint/authorization'
];
