exports = module.exports = function(server, immediateResponseCb) {
  
  
  function errorLogger(err, req, res, next) {
    console.log('!!! RESUME ERROR');
    console.log(err.message);
    console.log(err.stack);
    next(err);
  }
  
  
  return [ server.resume(
    immediateResponseCb,
    function completeTxn(req, txn, cb) {
      //console.log('DO SOMETHIGN WITH TXN, LOG, SESSION MGMT, ETC!!!');
      //console.log(txn);
      cb();
    }
  ), errorLogger ];
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  './authorize/processtransaction'
];
