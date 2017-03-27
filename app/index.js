exports = module.exports = {
  'server': require('./server'),
  'transactionstore': require('./transactionstore'),
  'code/exchange': require('./code/exchange'),
  'code/grant': require('./code/grant'),
  'code/dialect/jwt/encode': require('./code/dialect/jwt/encode'),
  'code/dialect/jwt/decode': require('./code/dialect/jwt/decode'),
  'implicit/grant': require('./implicit/grant'),
  'password/exchange': require('./password/exchange'),
  'ext/responsemode': require('./ext/responsemode'),
  'ext/webmessage': require('./ext/webmessage'),
  'ext/modes/formpost': require('./ext/modes/formpost'),
  'ext/modes/webmessage': require('./ext/modes/webmessage'),
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
