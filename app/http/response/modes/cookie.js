exports = module.exports = function() {
  return require('oauth2orize-cookierm');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/ResponseMode';
exports['@mode'] = 'cookie';
