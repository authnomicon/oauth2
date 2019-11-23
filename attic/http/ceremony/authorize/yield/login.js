exports = module.exports = function() {
  
  function transition(req, res, next) {
    req.state.authN = req.state.authN || {};
    req.state.authN.methods = req.state.authN.methods || [];
    
    if (req.authInfo) {
      if (req.authInfo.method) { req.state.authN.methods.push(req.authInfo.method) }
    }
    
    
    // TODO: Via should contain IdPs, if using federated auth
    //req.state.authN.via = req.state.authN.via || [];
    //if (req.authInfo) {
    //  req.state.authN.via.push(req.authInfo)
    //}
    return next();
  }
  
  function errorHandler(err, req, res, next) {
    req.state.authN = req.state.authN || {};
    req.state.authN.failureCount = (req.state.authN.failureCount || 0) + (req.yieldState.failureCount || 0);
    
    return next(err);
  }
  
  
  return [
    transition,
    errorHandler
  ];
};

exports['@require'] = [];
