exports = module.exports = function() {
  
  return function(scope, client, cb) {
    
    process.nextTick(function() {
      cb(null, 'USERINFO');
    });
    
  };
};

exports['@require'] = [];
