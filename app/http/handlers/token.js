exports = module.exports = function(server, issueToken, parse, authenticate, errorLogging) {
  //return server.token();
  
  // curl --data "client_id=1&client_secret=secret&grant_type=authorization_code&code=1234" http://127.0.0.1:8080/token
  
  return [
    parse('application/x-www-form-urlencoded'),
    authenticate(['client_secret_basic', 'client_secret_post', 'none']),
    server.token(),
    function mfaErrorHandler(err, req, res, next) {
      console.log('TOKEN ERROR!');
      console.log(err);
      console.log(err.stack);
      
      if (err.code !== 'mfa_required') {
        return next(err);
      }
      
      console.log('HANDLE MFA ERROR!');
      
      var ctx = {};
      ctx.user = err.user;
      ctx.client = req.user;
      ctx.audience = [ {
        id: 'http://localhost/mfa',
        secret: 'some-secret-shared-with-oauth-authorization-server'
        //secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd'
      } ];
      //ctx.permissions = [ { resource: resources[0], scope: decision.allowed } ];
      
      issueToken(ctx, function(ierr, mfaToken) {
        console.log('MFA TOKEN!');
        console.log(err);
        console.log(mfaToken)
        
        
        if (ierr) { return next(ierr); }
        
        
        var e = {};
        e.error = err.code || 'server_error';
        if (err.message) { e.error_description = err.message; }
        if (err.uri) { e.error_uri = err.uri; }
        e.mfa_token = mfaToken;
      
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(e));
        
        //return cb(null, mfaToken);
        //return cb(null, accessToken);
      });
      return;
      
      
      
    },
    errorLogging(),
    server.errorHandler()
  ];
  
};

exports['@require'] = [
  '../../server',
  '../../util/issuetoken',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
