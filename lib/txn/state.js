var clone = require('clone');


function StateStore(store) {
  this._store = store;
}

StateStore.prototype.serializeClient = function(fn) {
  this._serializeClientFunc = fn;
}

StateStore.prototype.deserializeClient = function(fn) {
  this._deserializeClientFunc = fn;
}


StateStore.prototype.load = function(req, cb) {
  var self = this;
  
  function loaded(err, state) {
    if (err) { return cb(err); }
    if (!state) { return cb(null); }
    
    state.transactionID = state.handle;
    self._deserializeClientFunc(state.client, function(err, client) {
      if (err) { return cb(err); }
      if (!client) {
        return cb(new Error('Failed to deserialize client'));
      }
      
      state.client = client;
      return cb(null, state);
    });
  }
  
  if (req.state && req.state.name == 'oauth2-authorize') {
    if (req.state.name !== 'oauth2-authorize') {
      return cb(new Error('State out of sync, expected oauth2-authorize, got: ' + req.state.name));
    }
    loaded(null, clone(req.state));
  } else {
    this._store.load(req, req.body.state, loaded);
  }
}

StateStore.prototype.store = function(req, cb) {
  var txn = req.oauth2;
  
  var self = this;
  this._serializeClientFunc(txn.client, function(err, client) {
    if (err) { return cb(err); }
    
    var state = {};
    state.name = 'oauth2-authorize';
    state.client = client;
    state.redirectURI = txn.redirectURI;
    state.req = txn.req;
    
    self._store.save(req, state, function(err, h) {
      if (err) { return cb(err); }
      
      // A transaction has been initiated by a client.  Due to the fact that
      // this is a request by an external party, the state is necessarily an
      // initial state, rather than a continuation of state internal to the
      // OAuth 2.0 server.  Set `req.state`, allowing any subsequent states
      // to resume the transaction.
      req.state = state;
      req.state.handle = h;
      cb(null, h);
    });
  });
}


module.exports = StateStore;
