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
    
    var state = {};
    state.name = 'oauth2-authorize';
    state.client = client;
    state.redirectURI = txn.redirectURI;
    if (txn.webOrigin) { state.webOrigin = txn.webOrigin; }
    state.req = txn.req;
    
    self._store.save(req, state, function(err, h) {
      if (err) { return cb(err); }
      cb(null, h);
    });
  });
}

TransactionStore.prototype.update = function(req, h, txn, cb) {
  var self = this;
  this._serializeClientFunc(txn.client, function(err, client) {
    if (err) { return cb(err); }
    
    var state = {};
    state.name = 'oauth2-authorize';
    state.initiatedAt = txn.initiatedAt;
    state.client = client;
    state.redirectURI = txn.redirectURI;
    if (txn.webOrigin) { state.webOrigin = txn.webOrigin; }
    state.req = txn.req;
    if (txn.locals) {
      if (txn.locals.authN) {
        state.authN = txn.locals.authN;
      }
    }
    
    self._store.update(req, h, state, function(err, h) {
      if (err) { return cb(err); }
      cb(null, h);
    });
  });
}

TransactionStore.prototype.remove = function(req, h, cb) {
  this._store.destroy(req, h, cb);
}


module.exports = TransactionStore;
