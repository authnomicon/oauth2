exports = module.exports = function(server) {
  return server.token();
};


exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/oauth2/Server' ];

exports['@implements'] = [
  'http://i.expressjs.com/endpoint',
  'http://schemas.modulate.io/js/aaa/oauth2/endpoint/token'
];
