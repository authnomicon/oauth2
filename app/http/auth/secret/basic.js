var internals = require('../../../../lib/auth/internals');


exports = module.exports = function(verify) {
  var Strategy = require('passport-http').BasicStrategy;
  
  var strategy = new Strategy(internals.wrapBasic(verify, 'client_secret_basic'));
  return strategy;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'client_secret_basic';
exports['@require'] = [ './verify' ];
