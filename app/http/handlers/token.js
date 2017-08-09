exports = module.exports = function(container, server, parse, authenticate, errorLogging, logger) {
  //return server.token();
  
  // curl --data "client_id=1&client_secret=secret&grant_type=authorization_code&code=1234" http://127.0.0.1:8080/token
  
  var stack = [
    parse('application/x-www-form-urlencoded'),
    authenticate(['client_secret_basic', 'client_secret_post', 'none']),
    server.token()
  ];
  
  return Promise.resolve(stack)
    .then(function(stack) {
      return container.create('http://schemas.authnomicon.org/js/oauth2/http/middleware/mfaRequiredErrorHandler')
        .then(function(mfaRequiredErrorHandler) {
          stack.push(mfaRequiredErrorHandler());
          return stack;
        }, function(err) {
          logger.notice('OAuth 2.0 Multi-Factor Authorization not available');
          return stack;
        });
    })
    .then(function(stack) {
      stack.push(errorLogging());
      stack.push(server.errorHandler());
      
      return stack;
    });
};

exports['@require'] = [
  '!container',
  '../../server',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/errorLogging',
  'http://i.bixbyjs.org/Logger'
];
