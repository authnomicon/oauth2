exports = module.exports = function(IoC, bearer, logger) {
  
  var stack = [];
  
  return Promise.resolve(stack)
    .then(function(parameterizers) {
      var components = IoC.components('http://schemas.authnomicon.org/js/http/oauth2/TokenFormatter');
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(parameterizers) {
          parameterizers.forEach(function(parameterizer, i) {
            logger.info('Loaded parameterizer for OAuth 2.0 token type: ' + components[i].a['@type']);
            stack.push(parameterizer);
          });
          
          stack.push(bearer);
        })
        .then(function() {
          return stack;
        });
    })
    .then(function(stack) {
      
      return function parameterize(params, client, cb) {
        var i = 0;
        function next(err, p) {
          if (err || p) { return cb(err, p); }
  
          var impl = stack[i++]
          if (!impl) { return cb(new Error('Failed to parameterize token')); }
  
          try {
            var arity = impl.length;
            if (arity == 3) {
              impl(params, client, next);
            } else if (arity == 2) {
              impl(params, next);
            } else {
              var rv = impl(params);
              next(null, rv);
            }
          } catch (ex) {
            next(ex);
          }
        }
        next();
      };
      
    });
};

exports['@require'] = [
  '!container',
  './types/bearer',
  'http://i.bixbyjs.org/Logger'
];
