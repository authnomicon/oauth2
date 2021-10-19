exports = module.exports = function() {
  return require('oauth2orize-fprm');
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseMode';
exports['@mode'] = 'form_post';
