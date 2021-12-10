exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.password(function(client, username, passwd, scope, body, authInfo, cb) {
    // TODO:
  });
}

exports['@implements'] = 'http://i.authnomicon.org/oauth2/token/http/GrantType';
exports['@type'] = 'password';
exports['@require'] = [];
