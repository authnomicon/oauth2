exports = module.exports = function() {
  return require('oauth2orize-cookierm');
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorize/http/ResponseMode';
exports['@mode'] = 'cookie';
