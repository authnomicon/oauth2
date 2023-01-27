exports = module.exports = function(evaluate, server, authenticator, store) {
  
  return [
    // parseCookies(),// TODO: Put this at app level? Why?
    //state(),
    require('flowstate')({ store: store }),
    authenticator.authenticate([ 'session' ], { multi: true }),
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
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
