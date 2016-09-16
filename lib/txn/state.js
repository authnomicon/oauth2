function StateStore(store) {
  this._store = store;
}

StateStore.prototype.serializeClient = function(fn) {
  this._serializeClientFunc = fn;
}

StateStore.prototype.deserializeClient = function(fn) {
  this._deserializeClientFunc = fn;
}


StateStore.prototype.store = function(req, cb) {
  var txn = req.oauth2;
  
  console.log('STORE TXN!!');
  console.log(txn);
}


module.exports = StateStore;
