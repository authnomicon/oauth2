exports = module.exports = function(server, validateClient, processTransaction, completeTransaction, prompt, errorLogging) {
  
  return [
    server.authorization(
      validateClient,
      processTransaction,
      completeTransaction
    ),
    prompt(),
    errorLogging(),
    server.authorizationErrorHandler()
  ];
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  './authorize/validateclient',
  './authorize/processtransaction',
  './authorize/completetransaction',
  '../middleware/prompt',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
