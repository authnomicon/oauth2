exports = module.exports = function(negotiateTokenContent, negotiateTokenType, tokens) {
  
  return function issueToken(ctx, to, options, cb) {
    console.log('ISSUE TOKEN!');
    console.log(ctx);
    
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    var topts = negotiateTokenType(ctx.client, ctx.audience);
    console.log(topts);
    
    var copts = negotiateTokenContent(ctx.audience);
    console.log(copts);
    
    
    copts.dialect = options.dialect || copts.dialect;
    copts.confidential = false;
    copts.audience = ctx.audience;
    
    //copts.type = 'http://schemas.modulate.io/tokens/jwt/twilio';
    //copts.dialect = 'http://schemas.modulate.io/tokens/jwt/twilio';
    
    tokens.encode('access', ctx, copts, function(err, token) {
      if (err) { return cb(err); }
      return cb(null, token);
    });
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken';
exports['@require'] = [
  './negotiateTokenContent',
  './negotiateTokenType',
  'http://i.bixbyjs.org/security/tokens'
];
