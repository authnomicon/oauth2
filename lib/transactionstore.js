function TransactionStore() {
}


TransactionStore.prototype.load = function(req, cb) {
  if (!req.state) { return cb(new Error('Unable to load OAuth 2.0 authorize transaction.')); }
  
  var txn = {};
  txn.client = req.state.client;
  //txn.req = state.req;
  txn.req = req.state.request;
  
  // TODO: Need to set the redirectURI used in request, for confirmation on code exchagne

  txn.redirectURI = req.state.redirectURI;
  if (req.state.webOrigin) { txn.webOrigin = req.state.webOrigin; }

  /*
  txn.locals = {
    issuer: req.state.issuer
  }
  */
  
  /*
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
  */
  
  return cb(null, txn);
}

TransactionStore.prototype.store = function(req, txn, cb) {
  // FIXME: state.returnTo is being autopopulated but not save.  not sure why its
  // auto-populated on an external state
  
  var state = {};
  
  // TODO: Ideally use Express's req.hostname here, as it does the trust proxy
  // stuff, but strips the port.   Need to find a solution.
  //var issuer = req.protocol + '://' + req.headers['host'];
  //state.issuer = issuer;
  
  state.client = {
    id: txn.client.id,
    name: txn.client.name
  };
  state.redirectURI = txn.redirectURI;
  if (txn.webOrigin) { state.webOrigin = txn.webOrigin; }
  
  state.request = txn.req;
  
  if (!req.user) {
    // Don't push state, instead just use return_to url.  Saves DDoS attacks.
    //return cb();
  }
  
  //state.expires = new Date(Date.now() + 3600000); // 1 hour
  
  req.pushState(state, '/oauth2/authorize/continue');
  
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
    id: txn.client.id,
    name: txn.client.name
  };
  req.state.redirectURI = txn.redirectURI;
  if (txn.webOrigin) { req.state.webOrigin = txn.webOrigin; }

  req.state.request = txn.req;
  //req.state.req = txn.req;

  return cb();
  
  /*
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
  */
}

TransactionStore.prototype.remove = function(req, h, cb) {
  req.state.destroy(cb);
}


module.exports = TransactionStore;
