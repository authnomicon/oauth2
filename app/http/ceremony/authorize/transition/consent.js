exports = module.exports = function() {
  
  return function transition(req, res, next) {
    req.state.consent = req.state.consent || [];
    req.state.consent.push(res.locals.consent);
    
    delete res.locals;
    return next();
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/flows/transition';
exports['@complete'] = 'consent';
exports['@continue'] = 'oauth2-authorize';
exports['@require'] = [];
