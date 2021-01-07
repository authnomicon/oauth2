exports = module.exports = function() {
  var TransactionStore = require('../../lib/transactionstore');
  
  return new TransactionStore();
};

exports['@singleton'] = true;
exports['@require'] = [];
