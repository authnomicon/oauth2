exports = module.exports = function(processTransaction, completeTransaction, server) {

  return [
    server.resume(
      processTransaction,
      completeTransaction
    )
  ];
};

exports['@require'] = [
  '../../handlers/authorize/processtransaction',
  '../../handlers/authorize/completetransaction',
  '../../../server'
];
