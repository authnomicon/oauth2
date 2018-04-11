var clone = require('clone');


function TransactionStore(store) {
  this._store = store;
}

TransactionStore.prototype.serializeClient = function(fn) {
  this._serializeClientFunc = fn;
}

TransactionStore.prototype.deserializeClient = function(fn) {
  this._deserializeClientFunc = fn;
}


TransactionStore.prototype.load = function(req, cb) {
  var self = this;
  
  function loaded(err, state) {
    if (err) { return cb(err); }
    if (!state) { return cb(null); }
    
    state.transactionID = state.handle;
    state.locals = {};
    if (state.authN) {
      state.locals.authN = state.authN;
      delete state.authN;
    }
    if (state.deviceCode) {
      state.locals.deviceCode = state.deviceCode;
      delete state.deviceCode;
    }
    if (state.consent) {
      state.locals.consent = state.consent;
      delete state.consent;
    }
    
    self._deserializeClientFunc(state.client, function(err, client) {
      if (err) { return cb(err); }
      if (!client) {
        return cb(new Error('Failed to deserialize client'));
      }
      
      state.client = client;
      return cb(null, state);
    });
  }
  
  if (req.state) {
    loaded(null, clone(req.state));
  } else {
    // FIXME: The following line is a workaround for a misleading exception thrown when /authorize
    //        is missing a required parameter
    /// AuthorizationError: Missing required parameter: response_type
    if (!req.body) { return loaded(null); }
    
    this._store.load(req, req.body.state, loaded);
  }
}

TransactionStore.prototype.store = function(req, txn, cb) {
  var self = this;
  this._serializeClientFunc(txn.client, function(err, client) {
    if (err) { return cb(err); }
    
    req.state.client = client;
    req.state.redirectURI = txn.redirectURI;
    if (txn.webOrigin) { req.state.webOrigin = txn.webOrigin; }
    req.state.req = txn.req;
    
    req.state.save(function(err) {
      return cb(err);
    });
  });
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
        state.authN = txn.locals.authN;
      }
      if (txn.locals.deviceCode) {
        state.deviceCode = txn.locals.deviceCode;
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
