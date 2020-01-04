exports = module.exports = function(codes) {
  
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
    
    //tokens.encode('urn:ietf:params:oauth:token-type:authorization_code', ctx, opt, function(err, code) {
    codes.encode('urn:ietf:params:oauth:token-type:jwt', ctx, opt.audience, opts, function(err, code) {
      if (err) { return cb(err); }
      return cb(null, code);
    });
  };
};

// TODO: Make this component protected, so it can be shared from same namespace with OIDC
exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/response/code/issueFunc';
exports['@require'] = [
  'http://schemas.authnomicon.org/js/oauth2/tokens/authorization-code'
];
