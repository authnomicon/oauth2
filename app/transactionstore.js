exports = module.exports = function(serializeClient, deserializeClient, s) {
  var TransactionStore = require('../lib/transactionstore');
  
  var store = new TransactionStore(s);
  store.serializeClient(serializeClient);
  store.deserializeClient(deserializeClient);
  
  return store;
};

exports['@singleton'] = true;
exports['@require'] = [
  './txn/serializeclient',  // TODO: rename folder to txn
  './txn/deserializeclient',
  'http://i.bixbyjs.org/http/workflow/StateStore'
];
