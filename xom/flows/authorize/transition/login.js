exports = module.exports = function() {
  
  return function transition(req, res, next) {
    req.state.authN = req.state.authN || {};
    // TODO: Add authN.time
    if (req.authInfo.method) {
      req.state.authN.methods = req.state.authN.methods || [];
      req.state.authN.methods.push(req.authInfo.method)
    }
    
    return next();
  };
};

exports['@require'] = [];
