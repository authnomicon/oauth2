exports = module.exports = function() {
  
  // TODO: Make an nodex-aaa-oauth2-acdc package, with claims as specified here:
  // https://openid.bitbucket.io/draft-acdc-01.html
  
  
  return function encode(msg, cb) {
    var claims = {}
      , perm
      , i, len;
      
    claims.sub = msg.user.id;
    claims.client_id = msg.client.id;
    
    // TODO: Add `azp` claim if client is confidential and expected to authenticate??
    
    if (msg.permissions) {
      claims.permissions = [];
      for (i = 0, len = msg.permissions.length; i < len; ++i) {
        perm = msg.permissions[i];
        claims.permissions.push({
          resource_id: perm.resource.id,
          scope: perm.scope.join(' ')
        });
      }
    }
    
    if (msg.redirectURI) {
      // TODO: Write a draft spec about this usage.
      claims.cnf = claims.cnf || {};
      claims.cnf.redirect_uri = msg.redirectURI;
    }
    
    
    // TODO: https://openid.bitbucket.io/draft-acdc-01.html
    // cnf claim with PKCE
  
    return cb(null, claims);
  };
};
