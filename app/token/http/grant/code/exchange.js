exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.code(issue);
}

exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/Exchange';
exports['@type'] = 'authorization_code';
exports['@require'] = [ './issue' ];
