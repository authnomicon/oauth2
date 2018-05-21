exports = module.exports = function(negotiateFormat, negotiateType, tokens) {
  
  return function issueToken(claims, audience, presenter, options, cb) {
    console.log('ISSUE TOKEN!');
    console.log(claims);
    
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    // FIXME:
    claims.audience = audience;
    
    negotiateType(audience, presenter, function(err, topts) {
      if (err) { return cb(err); }
      
      
    negotiateFormat(claims.audience, function(err, copts) {
    console.log(copts);
    
    
    copts.dialect = options.dialect || copts.dialect;
    copts.confidential = false;
    copts.audience = claims.audience;
    
    //copts.type = 'http://schemas.modulate.io/tokens/jwt/twilio';
    //copts.dialect = 'http://schemas.modulate.io/tokens/jwt/twilio';
    
    tokens.encode('access', claims, copts, function(err, token) {
      if (err) { return cb(err); }
      return cb(null, token);
    });
    });
    }); // negotiateType
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/util/issueToken';
exports['@require'] = [
  './negotiate/content',
  './negotiate/type',
  'http://i.bixbyjs.org/security/tokens'
];
