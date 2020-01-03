exports = module.exports = function(processRequest, server, authenticate, ceremony) {
  
  return ceremony(
    authenticate([ 'session' ]),
    server.resume(
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    processRequest
  );
};

exports['@require'] = [
  './authorize/process',
  '../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
