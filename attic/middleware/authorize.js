exports = module.exports = function(authorizer) {
  return function(req, next) {
    console.log('AUTHORIZING OAUTH 2.0 REQUEST...');
    
    authorizer.check(req, function(err, ok) {
      if (err) { return next(err); }
      
      next();
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/oauth2/Authorizer' ];
