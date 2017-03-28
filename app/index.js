exports = module.exports = {
  'server': require('./server'),
  'transactionstore': require('./transactionstore'),
  'code/exchange': require('./code/exchange'),
  'code/grant': require('./code/grant'),
  'code/issue/code': require('./code/issue/code'),
  'code/tokens/authorization-code/interpret': require('./code/tokens/authorization-code/interpret'),
  'code/tokens/authorization-code/translate': require('./code/tokens/authorization-code/translate'),
  'implicit/grant': require('./implicit/grant'),
  'implicit/issue': require('./implicit/issue'),
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
