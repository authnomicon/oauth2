exports = module.exports = function(clients) {
  
  return function parse(req, cb) {
    var ares = req.txn.res;
    return cb(null, ares, { grant: req.txn.grant });
  };
};

exports['@require'] = [];
