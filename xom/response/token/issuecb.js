exports = module.exports = function() {
  
  return function issueToken(client, user, ares, areq, locals, cb) {
    return cb(null, 'AN-ACCESS-TOKEN-SSSSSHHHH')
  };
};

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/issueTokenFunc';
exports['@require'] = [];
