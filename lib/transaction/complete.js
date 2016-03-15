exports = module.exports = function(server, parseCb) {
  
  // TODO: Implement cleaner state handling in oauth2orize.
  var middleware = server.decision(parseCb)[1];
  
  return function(req, res, next) {
    var txn = req.txn;
    
    req.oauth2 = {};
    // TODO: transactionID should not be necessary here.
    req.oauth2.transactionID = txn.transactionID;
    req.oauth2.client = txn.client;
    req.oauth2.redirectURI = txn.redirectURI;
    req.oauth2.req = txn.req;
    req.oauth2.info = txn.info;
    
    middleware(req, res, next);
  };
};

exports['@require'] = [
  'http://schemas.modulate.io/js/aaa/oauth2/Server',
  './_complete/parsecb'
];

exports['@implements'] = [
  'http://i.expressjs.com/middleware',
  'http://schemas.modulate.io/js/aaa/authz/middleware/complete'
];
exports['@protocol'] = [ 'oauth2' ];
