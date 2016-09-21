exports = module.exports = {
  'server': require('./lib/server'),
  'acs': require('./lib/acs'),
  'transactionstore': require('./xom/transactionstore'),
  'response/code': require('./xom/response/code'),
  'exchange/authorizationCode': require('./lib/exchange/authorizationCode')
};

exports.load = function(id) {
  try {
    return require('./xom/' + id);
  } catch (ex) {
    /*
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
    */
    
    try {
      return require('./lib/' + id);
    } catch (ex) {
      if (ex.code == 'MODULE_NOT_FOUND') { return; }
      throw ex;
    }
  }
};


exports.plugins = require('./lib/plugins');
