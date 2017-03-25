exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.password(issue);
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/grant';
exports['@type'] = 'password';
exports['@require'] = [ './issue' ];
