exports = module.exports = function(sts) {
  
  return function issueToken(claims, audience, presenter, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    sts.issue(claims, audience, presenter, function(err, token) {
      if (err) { return cb(err); }
      return cb(null, token);
    });
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken';
exports['@require'] = [
  'http://schemas.authnomicon.org/js/sts'
];
