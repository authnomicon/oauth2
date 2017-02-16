exports = module.exports = function(negotiateTokenContent, negotiateTokenType, Tokens) {
  
  return function issueToken(ctx, cb) {
    console.log('ISSUE TOKEN!');
    console.log(ctx);
    
    var topts = negotiateTokenType(ctx.client, ctx.resources);
    console.log(topts);
    
    var copts = negotiateTokenContent(ctx.resources);
    console.log(copts);
    
    
    Tokens.translate(copts.dialect, ctx, function(err, claims) {
      console.log(err);
      console.log(claims);
      
      if (err) { return cb(err); }
      var params = {};
      
      Tokens.seal(copts.type, claims, params, function(err, token) {
        console.log(err);
        console.log(token);
        
        if (err) { return cb(err); }
        return cb(null, token);
      });
    });
  };
};

exports['@singleton'] = true;
exports['@require'] = [
  './negotiateTokenContent',
  './negotiateTokenType',
  'http://i.bixbyjs.org/tokens'
];
