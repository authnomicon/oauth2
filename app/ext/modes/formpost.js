exports = module.exports = function() {
  return require('oauth2orize-fprm');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/responseMode';
exports['@mode'] = 'form_post';
