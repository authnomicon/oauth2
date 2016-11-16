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
  
  function unauthorizedError(err, req, res, next) {
    console.log('LOGIN ERROR');
    console.log(err);
    console.log(req.state);
    
    if (err.status !== 401) { return next(err); }
    // Unauthorized
    
    console.log('INCREMENT IT');
    
    req.state.authN = req.state.authN || { failureCount: 0 };
    req.state.authN.failureCount++;
    
    console.log(req.state);
    
    next();
  }
  
  
  
  return [
    transition,
    unauthorizedError
  ]
  
};

exports['@require'] = [];
