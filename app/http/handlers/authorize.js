exports = module.exports = function(continueHandler, OAuth2, validateClient, server, authenticate, ceremony) {
  var Request = require('../../../lib/request')
    , Response = require('../../../lib/response');
  
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  //return ceremony('/oauth2/authorize',
  return ceremony(
    authenticate([ 'session', 'anonymous' ]),
    server.authorization(
      validateClient,
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    continueHandler,
  { external: true, continue: '/oauth2/continue' });
};

exports['@require'] = [
  './continue',
  'http://i.authnomicon.org/oauth2/OAuth2Service',
  './authorize/validateclient',
  '../../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
