exports = module.exports = function() {
  return require('oauth2orize-response-mode').extensions();
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/RequestParameters';
exports['@name'] = 'response_mode';
