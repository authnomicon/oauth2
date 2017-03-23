exports = module.exports = function(ceremony, server, processTransaction) {
  
  function prompt(req, res, next) {
    var prompt = req.oauth2.info.prompt;
    var options = req.oauth2.info;
    delete options.prompt;
    options.state = req.oauth2.transactionID;
    
    switch (prompt) {
    case 'consent':
      options.clientID = req.oauth2.client.id;
      // TODO: Add audience
      break;
    }
    
    ceremony.goto(prompt, options, req, res, next);
  }


  return [
    server.resume(
      processTransaction,
      function completeTxn(req, txn, cb) {
        //console.log('DO SOMETHIGN WITH TXN, LOG, SESSION MGMT, ETC!!!');
        //console.log(txn);
        cb();
      }
    ),
    prompt,
    server.authorizationErrorHandler()
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Dispatcher',
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  '../../handlers/authorize/processtransaction'
];
