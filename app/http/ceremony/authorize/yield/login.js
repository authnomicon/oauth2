exports = module.exports = function() {
  
  function transition(req, res, next) {
    console.log('YEILD TO OAUTH2');
    console.log(req.state);
    console.log(req.yieldState)
    console.log(req.authInfo)
    
    req.state.authN = req.state.authN || {};
    req.state.authN.via = req.state.authN.via || [];
    if (req.authInfo) {
      req.state.authN.via.push(req.authInfo)
    }
    return next();
  }
  
  function errorHandler(err, req, res, next) {
    console.log('YEILD ERROR OAUTH2');
    
    if (req.yieldState) {
      req.state.authN = req.state.authN || {};
      req.state.authN.failureCount =  req.yieldState.failureCount;
    }
    
    return next(err);
  }
  
  
  return [
    transition,
    errorHandler
  ];
};

exports['@require'] = [];
