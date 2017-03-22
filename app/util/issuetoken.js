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
    
    
    copts.dialect = options.dialect || copts.dialect;
    
    Tokens.cipher(ctx, copts, function(err, token) {
      if (err) { return cb(err); }
      return cb(null, token);
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
