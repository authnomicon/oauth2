exports = module.exports = function(server, errorLogging) {

  return [
    errorLogging(),
    server.authorizationErrorHandler()
  ];
};

exports['@require'] = [
  '../../../server',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
