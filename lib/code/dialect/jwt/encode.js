exports = module.exports = function() {
  
  // TODO: Make an nodex-aaa-oauth2-acdc package, with claims as specified here:
  // https://openid.bitbucket.io/draft-acdc-01.html
  
  
  return function encodeAuthorizationCodeToJWT(ctx, cb) {
    console.log('TRANSLATE TO JWT AUTHZ CODE:');
    console.log(ctx);
    
    var claims = {}
      , perm, i, len;
      
    claims.sub = ctx.user.id;
    claims.cid = ctx.client.id;
    
    // TODO: Add `azp` claim if client is confidential and expected to authenticate??
    
    claims.prm = [];
    for (i = 0, len = ctx.permissions.length; i < len; ++i) {
      perm = ctx.permissions[i];
      claims.prm.push({
        rid: perm.resource.id,
        scp: perm.scope
      });
    }
    
    if (ctx.redirectURI) {
      // TODO: Write a draft spec about this usage.
      claims.cnf = claims.cnf || {};
      claims.cnf.redirect_uri = ctx.redirectURI;
    }
    
    
    // TODO: https://openid.bitbucket.io/draft-acdc-01.html
    // cnf claim with PKCE
      
      
    return cb(null, claims);
  };
};

exports['@implements'] = [
  'http://schemas.modulate.io/js/aaa/oauth2/code/dialect/jwt/encode',
];
