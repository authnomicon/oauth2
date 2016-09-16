exports = module.exports = function(s) {
  var StateStore = require('../lib/txn/state');
  
  var store = new StateStore(s);
  return store;
};

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/TransactionStore';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/http/flows/StateStore'
];
