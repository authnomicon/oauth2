exports = module.exports = function() {
  return require('oauth2orize-wmrm');
};

exports['@implements'] = 'module:oauth2orize.Responder';
exports['@mode'] = 'web_message';
