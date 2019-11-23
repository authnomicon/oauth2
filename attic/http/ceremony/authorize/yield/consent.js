exports = module.exports = function() {
  
  function transition(req, res, next) {
    req.state.consent = req.state.consent || [];
    req.state.consent.push(res.locals.consent);
    
    delete res.locals;
    return next();
  }
  
  
  return [
    transition
  ];
};

exports['@require'] = [];
