exports = module.exports = function() {
  
  return function(scope, client, cb) {
    
    process.nextTick(function() {
      cb(null, 'http://www.example.com/');
    });
    
  };
};

exports['@require'] = [];
