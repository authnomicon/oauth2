exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.password(issue);
}

exports['@implements'] = 'http://i.authnomicon.org/oauth2/http/Exchange';
exports['@type'] = 'password';
exports['@require'] = [ './issue' ];
