exports = module.exports = function(server, validateClient, processTransaction, completeTransaction, authenticate, initiateSession, prompt, errorLogging) {
  
  return [
    authenticate([ 'state', 'anonymous' ]),
    initiateSession,
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
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  './authorize/validateclient',
  './authorize/processtransaction',
  './authorize/completetransaction',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  '../middleware/initiatesession',
  '../middleware/prompt',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
