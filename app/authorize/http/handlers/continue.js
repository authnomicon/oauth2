exports = module.exports = function(evaluate, server, authenticate, state, session) {
  
  return [
    session(),
    state(),
    authenticate([ 'session' ], { multi: true }),
    server.resume(
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    evaluate
    // TODO: Add error handling middleware here
  ];
};

exports['@require'] = [
  '../middleware/evaluate',
  '../../../http/server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session'
];
