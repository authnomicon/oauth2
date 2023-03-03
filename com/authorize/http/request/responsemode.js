exports = module.exports = function() {
  return require('oauth2orize-response-mode').extensions();
};

exports['@implements'] = 'module:oauth2orize.RequestParametersProcessor';
