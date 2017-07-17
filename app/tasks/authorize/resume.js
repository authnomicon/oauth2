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
  '../../server',
  '../../http/handlers/authorize/processtransaction',
  '../../http/handlers/authorize/completetransaction',
  '../../middleware/prompt',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
