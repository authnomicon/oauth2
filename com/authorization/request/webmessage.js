exports = module.exports = function() {
  return require('oauth2orize-wmrm').extensions();
};

exports['@implements'] = 'module:oauth2orize.RequestParametersProcessor';
