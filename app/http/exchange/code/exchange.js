exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(issue);
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/Exchange';
exports['@type'] = 'authorization_code';
exports['@require'] = [ './issue' ];
