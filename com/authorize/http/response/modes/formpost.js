exports = module.exports = function() {
  return require('oauth2orize-fprm');
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorize/http/ResponseMode';
exports['@mode'] = 'form_post';
