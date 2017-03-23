exports = module.exports = {
  'server': require('./server'),
  'transactionstore': require('./transactionstore'),
  'code/response': require('./code/response'),
  'code/grant': require('./code/grant'),
  'code/dialect/jwt/encode': require('./code/dialect/jwt/encode'),
  'code/dialect/jwt/decode': require('./code/dialect/jwt/decode'),
  'token/response': require('./token/response'),
  'password/grant': require('./password/grant'),
  'util/issuetoken': require('./util/issuetoken')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
