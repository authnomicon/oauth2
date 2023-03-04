exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize');
  
  return oauth2orize.exchange.password(function(client, username, passwd, scope, body, authInfo, cb) {
    // TODO:
  });
}

exports['@implements'] = 'module:oauth2orize.tokenRequestHandler';
exports['@type'] = 'password';
exports['@require'] = [];
