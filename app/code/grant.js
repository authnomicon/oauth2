exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(issueCb);
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/grantType';
exports['@type'] = 'authorization_code';
exports['@require'] = [ './issue/token' ];
