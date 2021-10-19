exports = module.exports = function() {
  return require('oauth2orize-response-mode').extensions();
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/RequestParameters';
