exports = module.exports = function() {
  
  // TODO: Make an nodex-aaa-oauth2-acdc package, with claims as specified here:
  // https://openid.bitbucket.io/draft-acdc-01.html
  
  
  return function encodeAuthorizationCodeToJWT(ctx, cb) {
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

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/aaa/tokens/dialect/jwt/authorization-code';
