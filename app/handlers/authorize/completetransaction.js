exports = module.exports = function() {
  
  return function completeTransaction(req, txn, cb) {
    return cb();
  };
};
