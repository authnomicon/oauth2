exports = module.exports = function(parameterize, sts) {
  
  return function issue(claims, audience, presenter, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    sts.issue(claims, audience, presenter, function(err, token, params) {
      if (err) { return cb(err); }
      params = params || {};
      
      parameterize(params, presenter, function(err, params) {
        if (err) { return cb(err); }
        return cb(null, token);
      });
    });
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken';
exports['@require'] = [
  './parameterize',
  'http://schemas.authnomicon.org/js/sts'
];
