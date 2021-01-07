var clone = require('clone');


function TransactionStore() {
}

TransactionStore.prototype.serializeClient = function(fn) {
  this._serializeClientFunc = fn;
}

TransactionStore.prototype.deserializeClient = function(fn) {
  this._deserializeClientFunc = fn;
}


TransactionStore.prototype.load = function(req, cb) {
  if (!req.state) { return cb(new Error('Unable to load OAuth 2.0 authorize transaction.')); }
  
  var state = req.state
    , txn = {};
  
  txn.transactionID = state.handle;
  txn.req = state.req;
  txn.redirectURI = state.redirectURI;
  if (state.webOrigin) { txn.webOrigin = state.webOrigin; }
  txn.locals = {};
  if (state.authN) {
    txn.locals.authN = state.authN;
  }
  if (state.deviceCode) {
    txn.locals.deviceCode = state.deviceCode;
  }
  if (state.consent) {
    txn.locals.consent = state.consent;
  }
  
  this._deserializeClientFunc(state.client, function(err, client) {
    if (err) { return cb(err); }
    if (!client) {
      return cb(new Error('Failed to deserialize client'));
    }
    
    txn.client = client;
    return cb(null, txn);
  });
}

TransactionStore.prototype.store = function(req, txn, cb) {
  // transaction-less
  //return cb();
  
  // THESE TWO LINES ARE GOOD, for return_to handling
  //req.state.complete();
  //req.state.touch();
  //return cb();
  
  
  req.state.client = txn.client.id;
  req.state.redirectURI = txn.redirectURI;
  if (txn.webOrigin) { req.state.webOrigin = txn.webOrigin; }
  req.state.req = txn.req;
  
  return cb();
  
  // Let state machine doe it on redirect
  /*
  req.state.save(function(err) {
    return cb(err);
  });
  */
}

TransactionStore.prototype.update = function(req, h, txn, cb) {
  var self = this;
  this._serializeClientFunc(txn.client, function(err, client) {
    if (err) { return cb(err); }
    
    req.state.client = client;
    req.state.redirectURI = txn.redirectURI;
    if (txn.webOrigin) { req.state.webOrigin = txn.webOrigin; }
    req.state.req = txn.req;
    if (txn.locals) {
      if (txn.locals.authN) {
        req.state.authN = txn.locals.authN;
      }
      if (txn.locals.deviceCode) {
        req.state.deviceCode = txn.locals.deviceCode;
      }
    }
    
    req.state.save(function(err) {
      return cb(err);
    });
  });
}

TransactionStore.prototype.remove = function(req, h, cb) {
  req.state.destroy(cb);
}


module.exports = TransactionStore;
