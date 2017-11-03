exports = module.exports = function() {
  
  function transition(req, res, next) {
    req.state.authN = req.state.authN || {};
    req.state.authN.via = req.state.authN.via || [];
    if (req.authInfo) {
      req.state.authN.via.push(req.authInfo)
    }
    return next();
  }
  
  function errorHandler(err, req, res, next) {
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

exports['@implements'] = 'http://i.bixbyjs.org/http/flows/transition';
exports['@complete'] = 'login';
exports['@continue'] = 'oauth2-authorize';
exports['@require'] = [];
