exports = module.exports = function(verifyCb) {
  var Strategy = require('passport-oauth2-client-public').Strategy;
  
  var strategy = new Strategy(verifyCb);
  return strategy;
};


exports['@require'] = [ './none/verifycb' ];

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'none';
