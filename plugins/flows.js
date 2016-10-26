exports = module.exports = {
  //'authorize': require('./flows/authorize')
  'authorize/transition/consent': require('./flows/authorize/transition/consent')
};

exports.load = function(id) {
  try {
    return require('./auth/' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
