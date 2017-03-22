exports = module.exports = function(serializeClientCb, deserializeClientCb, s) {
  var StateStore = require('../lib/txn/state');
  
  var store = new StateStore(s);
  store.serializeClient(serializeClientCb);
  store.deserializeClient(deserializeClientCb);
  
  return store;
};

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/TransactionStore';
exports['@singleton'] = true;
exports['@require'] = [
  './szx/serializeclientcb',  // TODO: rename folder to txn
  './szx/deserializeclientcb',
  'http://i.bixbyjs.org/http/state/Store'
];
