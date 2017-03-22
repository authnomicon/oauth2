exports = module.exports = function(server, flows, validateClient, processTransaction, completeTransaction, errorLogging) {
  
  function prompt(req, res, next) {
    var prompt = req.oauth2.info.prompt;
    var options = req.oauth2.info;
    delete options.prompt;
    options.state = req.oauth2.transactionID;
    
    flows.goto(prompt, options, req, res, next);
  }
  
  
  return [
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
  'http://i.bixbyjs.org/http/state/Dispatcher',
  './authorize/validateclient',
  './authorize/processtransaction',
  './authorize/completetransaction',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
