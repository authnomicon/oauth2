exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(issueCb);
}

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/exchange';
exports['@type'] = 'authorization_code';
exports['@require'] = [ './authorizationCode/issuecb' ];
