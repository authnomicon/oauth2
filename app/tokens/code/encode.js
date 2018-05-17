exports = module.exports = function() {
  
  // TODO: Make an nodex-aaa-oauth2-acdc package, with claims as specified here:
  // https://openid.bitbucket.io/draft-acdc-01.html
  
  
  return function encode(msg, cb) {
    console.log('ENCODE MESSAGE');
    console.log(msg)
    
    
    var claims = {}
      , perm, i, len;
      
    claims.sub = msg.user.id;
    claims.cid = msg.client.id;
    
    // TODO: Add `azp` claim if client is confidential and expected to authenticate??
    
    claims.prm = [];
    for (i = 0, len = msg.permissions.length; i < len; ++i) {
      perm = msg.permissions[i];
      claims.prm.push({
        rid: perm.resource.id,
        scp: perm.scope
      });
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
