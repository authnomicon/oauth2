exports = module.exports = function() {
  
  function transition(req, res, next) {
    console.log('YEILD TO OAUTH2');
    
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

exports['@implements'] = 'http://i.bixbyjs.org/http/state/yielder';
exports['@resume'] = 'oauth2-authorize';
exports['@result'] = 'login';
exports['@require'] = [];
