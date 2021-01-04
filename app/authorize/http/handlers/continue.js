exports = module.exports = function(processRequest, server, authenticate, state) {
  
  return [
    state(),
    authenticate([ 'session' ]),
    server.resume(
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    processRequest
  ];
};

exports['@require'] = [
  './authorize/process',
  '../../../http/server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
