exports = module.exports = function() {
  
  return function completeTransaction(req, txn, cb) {
    // Flag this here because oauth2orize.authorize or oauth2orize.resume hijackes the respone ending process, halting
    // the middleware from proceeding if the transaction is complete.  Therefore we don't fall throuhg
    // the ceremony the execute the finish phase.
    req.state.complete();
    
    return cb();
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/authorize/completeTransactionFunc';
