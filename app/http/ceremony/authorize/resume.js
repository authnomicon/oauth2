exports = module.exports = function(processTransaction, completeTransaction, server, continueHandler) {

  function prompt(req, res, next) {
    res.prompt();
  }


  return [
    server.resume(
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      },
      //processTransaction,
      completeTransaction
    ),
    continueHandler
    //prompt
  ];
};

exports['@require'] = [
  '../../handlers/authorize/processtransaction',
  '../../handlers/authorize/completetransaction',
  '../../../server',
  '../../handlers/continue',
];
