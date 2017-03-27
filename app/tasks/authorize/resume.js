exports = module.exports = function(server, processTransaction, completeTransaction, prompt, errorLogging) {

  return [
    server.resume(
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
  '../../handlers/authorize/processtransaction',
  '../../handlers/authorize/completetransaction',
  '../../middleware/prompt',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
