exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.password(issue);
}

exports['@implements'] = 'http://i.authnomicon.org/oauth2/token/http/AuthorizationGrantExchange';
exports['@type'] = 'password';
exports['@require'] = [ './password/issue' ];
