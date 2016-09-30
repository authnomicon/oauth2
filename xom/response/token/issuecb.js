exports = module.exports = function() {
  
  // NOTE: Do not issue refresh tokens.
  
  return function issueToken(client, user, ares, areq, locals, cb) {
    return cb(null, 'AN-ACCESS-TOKEN-SSSSSHHHH')
  };
};

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/issueTokenFunc';
exports['@require'] = [];
