function TransactionStore() {
}


TransactionStore.prototype.load = function(req, cb) {
  process.nextTick(function() {
    if (!req.state) { return cb(new Error('OAuth 2.0 requires state support. Did you forget to use `flowstate` middleware?')); }
    
    var txn = {};
    txn.client = req.state.client;
    if (req.state.redirectURI) { txn.redirectURI = req.state.redirectURI; }
    if (req.state.webOrigin) { txn.webOrigin = req.state.webOrigin; }
    txn.req = req.state.request;
    txn.ctx = {};
    if (req.state.selectSession) {
      txn.ctx.selectedAccount = true;
    }
  
    return cb(null, txn);
  });
}

TransactionStore.prototype.store = function(req, txn, cb) {
  process.nextTick(function() {
    var state = {};
    state.client = {
      id: txn.client.id,
      name: txn.client.name
    };
    if (txn.redirectURI) { state.redirectURI = txn.redirectURI; }
    if (txn.webOrigin) { state.webOrigin = txn.webOrigin; }
    state.request = txn.req;
  
    req.pushState(state, '/oauth2/authorize/continue');
    return cb();
  });
}

TransactionStore.prototype.update = function(req, h, txn, cb) {
  process.nextTick(function() {
    req.state.continue();
    return cb();
  });
}

TransactionStore.prototype.remove = function(req, h, cb) {
  req.state.destroy(cb);
}


module.exports = TransactionStore;
