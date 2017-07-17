exports = module.exports = function(verify) {
  var Strategy = require('passport-oauth2-client-public').Strategy;
  
  var strategy = new Strategy(verify);
  return strategy;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'none';
exports['@require'] = [ './none/verify' ];
