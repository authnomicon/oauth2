exports = module.exports = function(server, continueHandler) {

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
      //processTransaction
    ),
    continueHandler
    //prompt
  ];
};

exports['@require'] = [
  '../../../server',
  '../../handlers/authorize/process',
];
