exports = module.exports = function() {
  return require('oauth2orize-response-mode').extensions();
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/request/parameters';
exports['@name'] = 'response mode';
