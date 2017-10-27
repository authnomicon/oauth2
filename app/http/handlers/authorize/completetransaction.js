exports = module.exports = function() {
  
  return function completeTransaction(req, txn, cb) {
    return cb();
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/authorize/completeTransactionFunc';
