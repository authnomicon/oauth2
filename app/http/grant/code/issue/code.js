exports = module.exports = function(codes) {
  
  return function issueCode(client, redirectURI, user, ares, areq, locals, cb) {
    var ctx = {};
    ctx.user = user;
    ctx.client = client;
    ctx.permissions = ares.permissions;
    ctx.redirectURI = redirectURI;
    //ctx.audience = [ {
    //  id: 'http://localhost/authorization_code',
    //  secret: 'some-secret-shared-with-oauth-authorization-server'
    //} ];
    // TODO: Add PKCE challenge here (if any)
    
    var opt = {};
    //opt.type = 'application/fe26.2';
    //opt.type = 'application/x-fernet-json';
    opt.dialect = 'http://schemas.authnomicon.org/tokens/jwt/authorization-code';
    // TODO: Make this confidential
    opt.confidential = false;
    //opt.audience = ctx.audience;
    opt.audience = [ {
      id: 'AS1AC',
      identifier: 'http://localhost/authorization_code',
      secret: 'some-secret-shared-with-oauth-authorization-server'
    } ];
    
    // TODO: Ensure that code has a TTL of 10 minutes
    console.log('CIPHER THE CODE');
    console.log(ctx);
    console.log(opt);
    
    //tokens.encode('urn:ietf:params:oauth:token-type:authorization_code', ctx, opt, function(err, code) {
    codes.encode('urn:ietf:params:oauth:token-type:jwt', ctx, opt, function(err, code) {
      if (err) { return cb(err); }
      return cb(null, code);
    });
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/issueCodeFunc';
exports['@require'] = [
  'http://schemas.authnomicon.org/js/oauth2/tokens/authorization-code'
];
