exports = module.exports = function(processTransaction, completeTransaction, server) {

  function prompt(req, res, next) {
    res.prompt();
  }


  return [
    server.resume(
      processTransaction,
      completeTransaction
    ),
    prompt
  ];
};

exports['@require'] = [
  '../../handlers/authorize/processtransaction',
  '../../handlers/authorize/completetransaction',
  '../../../server'
];
