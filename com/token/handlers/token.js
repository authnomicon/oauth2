exports = module.exports = function(IoC, server, authenticator, /*errorLogging,*/ logger) {
  //return server.token();
  
  // curl --data "client_id=1&client_secret=secret&grant_type=authorization_code&code=1234" http://127.0.0.1:8080/token
  
  var stack = [
    require('body-parser').urlencoded({ extended: false }),
    authenticator.authenticate(['oauth2-client-authentication/client_secret_basic', 'oauth2-client-authentication/client_secret_post', 'oauth2-client-authentication/none'], { session: false }),
    server.token()
  ];
  
  return Promise.resolve(stack)
    .then(function(stack) {
      return IoC.create('http://schemas.authnomicon.org/js/oauth2/http/middleware/mfaRequiredErrorHandler')
        .then(function(mfaRequiredErrorHandler) {
          stack.push(mfaRequiredErrorHandler());
          return stack;
        }, function(err) {
          logger.notice('OAuth 2.0 multi-factor authorization not available');
          return stack;
        });
    })
    .then(function(stack) {
      //stack.push(errorLogging());
      stack.push(server.errorHandler());
      return stack;
    });
};

exports['@require'] = [
  '!container',
  '../../../http/server',
  'module:passport.Authenticator', // TODO: make an oauth2-specific authenticator
  //'http://i.bixbyjs.org/http/middleware/errorLogging',
  'http://i.bixbyjs.org/Logger'
];
