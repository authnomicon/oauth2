exports = module.exports = function() {
  
  return function keyGeneration(resources, client, cb) {
    if (!Array.isArray(resources)) {
      resources = [ resources ];
    }
    
    return cb(null, { secret: 'foo' });
  };
};
