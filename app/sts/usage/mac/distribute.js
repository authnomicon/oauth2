exports = module.exports = function(rsg) {
  
  return function keyGeneration(resources, client, cb) {
    if (!Array.isArray(resources)) {
      resources = [ resources ];
    }
    
    var key = rsg.generate(32);
    
    
    return cb(null, { secret: key });
  };
};

exports['@require'] = [ 'http://i.bixbyjs.org/crypto/RSG' ];
