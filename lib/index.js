exports = module.exports = {
  'server': require('./server'),
  'transactionstore': require('./transactionstore'),
  'response/code': require('./response/code'),
  'response/token': require('./response/token'),
  'exchange/authorizationcode': require('./exchange/authorizationcode'),
  'code': require('./code'),
  'code/codec': require('./code/codec')
};

exports.load = function(id) {
  try {
    return require('./xom/' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
