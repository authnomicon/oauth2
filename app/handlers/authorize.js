exports = module.exports = function(server, validateRequestCb, immediateResponseCb) {
  return server.authorization(
    validateRequestCb,
    immediateResponseCb,
    function completeTxn(req, txn, cb) {
      console.log('&&&&& DO SOMETHIGN WITH TXN, LOG, SESSION MGMT, ETC!!!');
      console.log(txn);
      cb();
    }
  );
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  './authorize/validaterequest',
  './authorize/processtransaction'
];
