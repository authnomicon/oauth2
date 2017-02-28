exports = module.exports = function(negotiateTokenContent, negotiateTokenType, Tokens) {
  
  return function issueToken(ctx, options, cb) {
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
    
    
    Tokens.translate(options.dialect || copts.dialect, ctx, function(err, claims) {
      console.log(err);
      console.log(claims);
      
      if (err) { return cb(err); }
      
      var type = copts.type
        , params = copts;
        
      params.audience = ctx.audience;
      delete params.type;
      
      Tokens.seal(type, claims, params, function(err, token) {
        console.log(err);
        console.log(token);
        
        if (err) { return cb(err); }
        return cb(null, token);
      });
    });
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken';
exports['@singleton'] = true;
exports['@require'] = [
  './negotiateTokenContent',
  './negotiateTokenType',
  'http://i.bixbyjs.org/tokens'
];
