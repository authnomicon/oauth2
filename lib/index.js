/**
 * Expose component suite.
 */
exports = module.exports = function oauth2(id) {
  var map = {
    'server': './server',
    'acs': './acs',
    'auth/client_secret_basic': './auth/client_secret_basic',
    'auth/client_secret_post': './auth/client_secret_post',
    'auth/_secret/verifycb': './auth/_secret/verifycb',
    'auth/none': './auth/none',
    'auth/_none/verifycb': './auth/_none/verifycb',
    'endpoints/authorize': './endpoints/authorize',
    'endpoints/_authorize/immediateresponsecb': './endpoints/_authorize/immediateresponsecb',
    'endpoints/_authorize/validaterequestcb': './endpoints/_authorize/validaterequestcb',
    'endpoints/token': './endpoints/token',
    'endpoints/openid/configuration': './endpoints/openid/configuration',
    'exchange/authorizationCode': './exchange/authorizationCode',
    'exchange/_authorizationCode/issuecb': './exchange/_authorizationCode/issuecb',
    'response/code': './response/code',
    'response/_code/issuecb': './response/_code/issuecb',
    'transaction/complete': './transaction/complete',
    'transaction/_complete/parsecb': './transaction/_complete/parsecb',
    'state/deserializeclientcb': './state/deserializeclientcb',
    'state/serializeclientcb': './state/serializeclientcb'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};

exports.used = function(container) {
  // OAuth 2.0 server and endpoints.
  container.register('server');
  container.register('acs');
  container.register('endpoints/authorize');
  container.register('endpoints/token');
  
  // Response type plug-ins.
  container.register('response/code');
  
  // Exchange plug-ins.
  container.register('exchange/authorizationCode');
  
  // Client authentication plug-ins.
  //container.register('auth/client_secret_basic');
  //container.register('auth/client_secret_post');
  //container.register('auth/none');
  
  
  //container.register('authorizer');
  //container.register('clients/federateddirectory');
  
  // Plug-ins for fetching federated client metadata.
  //container.register('clients/directory/federated/configuration');
}


exports.plugins = require('./plugins');
