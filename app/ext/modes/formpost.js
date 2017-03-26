exports = module.exports = function() {
  return require('oauth2orize-fprm');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/response/mode';
exports['@mode'] = 'form_post';
