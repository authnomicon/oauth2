var internals = require('../../../../lib/auth/internals');


exports = module.exports = function(verify) {
  var Strategy = require('passport-oauth2-client-password').Strategy;
  
  var strategy = new Strategy(internals.wrapBasic(verify, 'client_secret_post'));
  return strategy;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'client_secret_post';
exports['@require'] = [ './verify' ];
