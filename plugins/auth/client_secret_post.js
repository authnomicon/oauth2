var internals = require('../../lib/auth/internals');


exports = module.exports = function(verifyCb) {
  var Strategy = require('passport-oauth2-client-password').Strategy;
  
  var strategy = new Strategy(internals.wrapBasic(verifyCb, 'client_secret_post'));
  return strategy;
};


exports['@require'] = [ './secret/verifycb' ];

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'client_secret_post';
