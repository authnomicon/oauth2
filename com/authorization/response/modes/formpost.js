exports = module.exports = function() {
  return require('oauth2orize-fprm');
};

exports['@implements'] = 'module:oauth2orize.Responder';
exports['@mode'] = 'form_post';
