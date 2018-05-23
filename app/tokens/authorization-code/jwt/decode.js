exports = module.exports = function() {
  
  
  return function decode(claims, cb) {
    var ctx = {}
      , prm, keys, key
      , i, len;
    
    ctx.user = { id: claims.sub };
    ctx.client = { id: claims.client_id };
    ctx.permissions = [];
    
    if (claims.permissions) {
      for (i = 0, len = claims.permissions.length; i < len; ++i) {
        prm = claims.permissions[i];
        ctx.permissions.push({
          resource: { id: prm.resource_id },
          scope: prm.scope.split(' ')
        });
      }
    }
    
    if (claims.cnf) {
      ctx.confirmation = [];
      
      keys = Object.keys(claims.cnf);
      for (i = 0, len = keys.length; i < len; ++i) {
        key = keys[i];
       
        switch (key) {
        case 'redirect_uri':
          ctx.confirmation.push({ method: 'redirect-uri', uri: claims.cnf.redirect_uri });
          break;
        case 'code_challenge':
        case 'code_challange':
          ctx.confirmation.push({
            method: 'pkce',
            challenge: claims.cnf.code_challenge || claims.cnf.code_challange,
            transform: claims.cnf.code_challenge_method || claims.cnf.code_challange_method || 'none'
          });
          break;
        case 'code_challenge_method':
        case 'code_challange_method':
          break;
        default:
          ctx.confirmation.push({ method: 'unknown', name: key });
          break;
        }
      }
    }
    
    
    // TODO: Add options argument as way to signal required/optional claims
    // and standardized "header-like" claims (such as confirmation), which
    // may depend on the scheme negoatiated (PoP, Named)
    // https://tools.ietf.org/html/draft-sakimura-oauth-rjwtprof-05
    
    return cb(null, ctx);
  };
};
