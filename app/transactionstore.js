exports = module.exports = function(serializeClient, deserializeClient) {
  var TransactionStore = require('../lib/transactionstore');
  
  var store = new TransactionStore();
  store.serializeClient(serializeClient);
  store.deserializeClient(deserializeClient);
  
  return store;
};

exports['@singleton'] = true;
exports['@require'] = [
  './txn/serializeclient',  // TODO: rename folder to txn
  './txn/deserializeclient'
];
