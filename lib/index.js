exports = module.exports = {
  'server': require('./server'),
  'acs': require('./acs'),
  'endpoints/authorize': require('./endpoints/authorize'),
  'endpoints/token': require('./endpoints/token'),
  'response/code': require('./response/code'),
  'exchange/authorizationCode': require('./exchange/authorizationCode')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};


exports.plugins = require('./plugins');
