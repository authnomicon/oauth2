exports = module.exports = function() {
  return require('oauth2orize-wmrm');
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseMode';
exports['@mode'] = 'web_message';
