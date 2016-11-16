exports = module.exports = function() {
  
  function transition(req, res, next) {
    req.state.authN = req.state.authN || {};
    // TODO: Add authN.time
    if (req.authInfo.method) {
      req.state.authN.methods = req.state.authN.methods || [];
      req.state.authN.methods.push(req.authInfo.method)
    }
    
    return next();
  }
  
  function unauthorizedErrorHandler(err, req, res, next) {
    if (err.status !== 401) { return next(err); }
    // Unauthorized
    
    // Increment the counter for failed authentication attempts and `next()`
    // _without_ an error.  When the authorization transaction is resumed, it
    // will inspect the counter and react appropriately.  This allows the
    // ceremony to re-prompt the user for credentials a configurable number of
    // times, redirecting back to the client if and when the limit is exceeded.
    req.state.authN = req.state.authN || { failureCount: 0 };
    req.state.authN.failureCount++;
    next();
  }
  
  
  
  return [
    transition,
    unauthorizedErrorHandler
  ]
  
};

exports['@require'] = [];
