exports = module.exports = function(processRequest, validateClient, server, authenticate, ceremony) {
  
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
    processRequest,
  { external: true, continue: '/oauth2/authorize/continue' });
};

exports['@require'] = [
  './authorize/process',
  './authorize/validateclient',
  '../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
