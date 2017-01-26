exports = module.exports = {
  'server': require('./server'),
  'transactionstore': require('./transactionstore'),
  'code/response': require('./code/response'),
  'code/grant': require('./code/grant'),
  'token/response': require('./token/response'),
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
