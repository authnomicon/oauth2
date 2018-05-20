exports = module.exports = function(rsg) {
  
  // https://tools.ietf.org/html/draft-ietf-oauth-v2-http-mac-05
  // https://tools.ietf.org/html/draft-hammer-oauth-v2-mac-token-05
  
  return function keyGeneration(resources, client, cb) {
    if (!Array.isArray(resources)) {
      resources = [ resources ];
    }
    
    var key = rsg.generate(32);
    
    
    return cb(null, { secret: key });
  };
};

exports['@require'] = [ 'http://i.bixbyjs.org/crypto/RSG' ];
