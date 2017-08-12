exports = module.exports = function(authenticate, server, validateClient, processTransaction, completeTransaction, prompt, errorLogging) {
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  return [
    authenticate([ 'session', 'anonymous' ]),
    server.authorization(
      validateClient,
      processTransaction,
      completeTransaction
    ),
    prompt,
    errorLogging(),
    server.authorizationErrorHandler()
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/authenticate',
  '../../server',
  './authorize/validateclient',
  './authorize/processtransaction',
  './authorize/completetransaction',
  '../middleware/prompt',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
