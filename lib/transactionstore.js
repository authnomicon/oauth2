var clone = require('clone');


function TransactionStore() {
}


TransactionStore.prototype.load = function(req, cb) {
  if (!req.state) { return cb(new Error('Unable to load OAuth 2.0 authorize transaction.')); }
  
  var state = req.state
    , txn = {};
  
  txn.client = state.client;
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
  
  return cb(null, txn);
  
  /*
  this._deserializeClientFunc(state.client, function(err, client) {
    if (err) { return cb(err); }
    if (!client) {
      return cb(new Error('Failed to deserialize client'));
    }
    
    txn.client = client;
    return cb(null, txn);
  });
  */
}

TransactionStore.prototype.store = function(req, txn, cb) {
  // FIXME: state.returnTo is being autopopulated but not save.  not sure why its
  // auto-populated on an external state.
  
  
  req.state.responseType = txn.req.type;
  
  req.state.client = {
    id: txn.client.id,
    name: txn.client.name
  };
  req.state.redirectURI = txn.redirectURI;
  if (txn.webOrigin) { req.state.webOrigin = txn.webOrigin; }
  
  req.state.scope = txn.req.scope;
  req.state.state = txn.req.state;
  //req.state.req = txn.req;
  
  return cb();
  
  // Let state machine doe it on redirect
  /*
  req.state.save(function(err) {
    return cb(err);
  });
  */
}

TransactionStore.prototype.update = function(req, h, txn, cb) {
    
  req.state.client = {
    id: txn.client.id
  };
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
}

TransactionStore.prototype.remove = function(req, h, cb) {
  req.state.destroy(cb);
}


module.exports = TransactionStore;
