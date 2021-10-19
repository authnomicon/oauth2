exports = module.exports = function(sts) {
  
  return function issueCode(client, redirectURI, user, ares, areq, locals, cb) {
    var ctx = {};
    ctx.client = client;
    ctx.redirectURI = redirectURI;
    ctx.user = user;
    
    if (ares.scope) {
      ctx.scope = ares.scope;
    }
    // TODO: (multiple) resource-specific permissions
    //ctx.permissions = ares.permissions;
    
    var opt = {};
    //opt.type = 'application/fe26.2';
    //opt.type = 'application/x-fernet-json';
    opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/authorization-code';
    opt.audience = [ {
      id: 'AS1AC',
      identifier: 'http://localhost/authorization_code',
      secret: 'some-secret-shared-with-oauth-authorization-server'
    } ];
    
    // TODO: Ensure that code has a TTL of 10 minutes

    var opts = {}
    opts.confidential = false;
    
    console.log('SEAL THIS MESSAGE');
    console.log(ctx);
    console.log(opts);
    
    sts.issue(ctx, 'authorization_code', function(err, code) {
      console.log('ISSUED AUTHORIZATION CODE');
      console.log(err);
      console.log(code);
      
      if (err) { return cb(err); }
      return cb(null, code);
    });
    
    
    /*
    var seal = tokens.createSeal('authorization_code');
    seal.seal(msg, function(err, token) {
      
    });
    */
    return;
    
    
    
    //tokens.encode('urn:ietf:params:oauth:token-type:authorization_code', ctx, opt, function(err, code) {
    codes.encode('urn:ietf:params:oauth:token-type:jwt', ctx, opt.audience, opts, function(err, code) {
      if (err) { return cb(err); }
      
      console.log('ISSUED AUTHORIZATION CODE!!!');
      console.log(code);
      
      return cb(null, code);
    });
  };
};

// TODO: Make this component protected, so it can be shared from same namespace with OIDC
exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/response/code/issueFunc';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/SecurityTokenService'
];
