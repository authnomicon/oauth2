exports = module.exports = function() {
  
  return function transition(req, res, next) {
    req.state.authN = req.state.authN || {};
    if (req.authInfo.method) {
      req.state.authN.methods = req.state.authN.methods || [];
      req.state.authN.methods.push(req.authInfo.method)
    }
    
    return next();
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/flows/transition';
exports['@complete'] = 'mfa'; // TODO: Rename this to stepup???
exports['@continue'] = 'oauth2-authorize';
exports['@require'] = [];
