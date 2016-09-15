
exports = module.exports = function http_auth_oauth2client() {
  
  var bundle = {
    'client_secret_basic': require('../auth/client_secret_basic'),
    'client_secret_post': require('../auth/client_secret_post'),
    'none': require('../auth/none')
  }
  
  bundle.load = function(id) {
  try {
    return require('../auth/' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
  
  
  /*
  function bundle(id) {
    var map = {
      'client_secret_basic': '../auth/client_secret_basic',
      'client_secret_post': '../auth/client_secret_post',
      '_secret/verifycb': '../auth/_secret/verifycb',
      'none': '../auth/none',
      '_none/verifycb': '../auth/_none/verifycb',
    };
    
    var mid = map[id];
    if (mid) {
      return require(mid);
    }
  }
  
  bundle.used = function(container) {
    // Client authentication plug-ins.
    container.register('client_secret_basic');
    container.register('client_secret_post');
    container.register('none');
  }
  */
  
  
  return bundle;
};
