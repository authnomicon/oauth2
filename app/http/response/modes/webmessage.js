exports = module.exports = function() {
  return require('oauth2orize-wmrm');
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorize/http/ResponseMode';
exports['@mode'] = 'web_message';
