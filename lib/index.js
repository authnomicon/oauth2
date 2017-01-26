exports = module.exports = {
  'server': require('./server'),
  'transactionstore': require('./transactionstore'),
  'response/code': require('./response/code'),
  'token/response': require('./token/response'),
  'exchange/authorizationcode': require('./exchange/authorizationcode'),
  'code': require('./code'),
  'code/codec': require('./code/codec')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
