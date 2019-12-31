exports = module.exports = function(continueHandler, OAuth2, validateClient, server, authenticate, ceremony) {
  
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  //return ceremony('/oauth2/authorize',
  return ceremony(
    authenticate([ 'session' ]),
    server.resume(
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    function(req, res, next) {
      console.log('OAUTH2 RESUME!!!!');
      console.log(req.state);
      next();
    },
    continueHandler
  );
};

exports['@require'] = [
  './authorize/process',
  'http://i.authnomicon.org/oauth2/OAuth2Service',
  './authorize/validateclient',
  '../../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
