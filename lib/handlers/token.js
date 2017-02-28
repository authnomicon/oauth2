exports = module.exports = function(server, issueToken) {
  //return server.token();
  
  return [
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
        secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd'
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
    server.errorHandler()
  ];
  
};

exports['@require'] = [
  'http://schema.modulate.io/js/aaa/oauth2/Server',
  '../util/issuetoken'
];
