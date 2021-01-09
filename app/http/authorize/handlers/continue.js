exports = module.exports = function(evaluate, server, authenticate, state) {
  
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
    evaluate
    // TODO: Add error handling middleware here
  ];
};

exports['@require'] = [
  '../middleware/evaluate',
  '../../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
