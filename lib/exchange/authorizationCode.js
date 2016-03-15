exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(issueCb);
}

exports['@require'] = [ './_authorizationCode/issuecb' ];
exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/exchange';
