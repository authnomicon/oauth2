exports = module.exports = function(server, processTransaction, completeTransaction, prompt) {

  return [
    server.resume(
      processTransaction,
      completeTransaction
    ),
    //prompt(),
    server.authorizationErrorHandler()
  ];
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  '../../handlers/authorize/processtransaction',
  '../../handlers/authorize/completetransaction',
  '../../middleware/prompt',
];
