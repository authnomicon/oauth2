exports = module.exports = function(validateClient, processTransaction, completeTransaction, server, authenticate, ceremony) {
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  return ceremony('oauth2/authorize',
    authenticate([ 'session', 'anonymous' ]),
    server.authorization(
      validateClient,
      processTransaction,
      completeTransaction
    ),
  { external: true });
};

exports['@require'] = [
  './authorize/validateclient',
  './authorize/processtransaction',
  './authorize/completetransaction',
  '../../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
