exports = module.exports = function() {
  return require('oauth2orize-wmrm').extensions();
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/RequestParameters';
exports['@name'] = 'web_message_uri';
