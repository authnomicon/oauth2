exports = module.exports = function() {
  
  
  return function translate(ctx, cb) {
    console.log('TRANSLATE TO JWT AUTHZ CODE:');
    console.log(ctx);
    
    var claims = {}
      , perm, i, len;
      
    claims.sub = ctx.user.id;
    claims.cid = ctx.client.id;
    
    claims.prm = [];
    for (i = 0, len = ctx.permissions.length; i < len; ++i) {
      perm = ctx.permissions[i];
      claims.prm.push({
        rid: perm.resource.id,
        scp: perm.scope
      });
    }
      
      
    return cb(null, claims);
  };
};

exports['@implements'] = [
  'http://schemas.modulate.io/js/aaa/oauth2/code/dialect/jwt/encode',
];
