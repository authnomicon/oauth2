exports = module.exports = function() {
  return require('oauth2orize-wmrm');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/response/mode';
exports['@mode'] = 'web_message';
