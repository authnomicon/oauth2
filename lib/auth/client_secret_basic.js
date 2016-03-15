var internals = require('./internals');


exports = module.exports = function(verifyCb) {
  var Strategy = require('passport-http').BasicStrategy;
  
  var strategy = new Strategy(internals.wrapBasic(verifyCb, 'client_secret_basic'));
  return strategy;
};


exports['@require'] = [ './_secret/verifycb' ];

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'client_secret_basic';
