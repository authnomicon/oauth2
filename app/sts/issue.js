exports = module.exports = function(format, sts) {
  
  return function issue(claims, audience, presenter, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    sts.issue(claims, audience, presenter, function(err, token, params) {
      if (err) { return cb(err); }
      params = params || {};
      
      format(params, presenter, function(err, attrs) {
        if (err) { return cb(err); }
        return cb(null, token, attrs);
      });
    });
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken';
exports['@require'] = [
  './format',
  'http://schemas.authnomicon.org/js/sts'
];
