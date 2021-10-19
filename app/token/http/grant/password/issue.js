exports = module.exports = function(sts, aaa, password) {
  var MFARequiredError = require('oauth2orize-mfa').MFARequiredError;
  
  
  return function issue(client, username, passwd, scope, body, authInfo, cb) {
    
    password.verify(username, passwd, function(err, user) {
      if (err) { return cb(err); }
      
      var audience = body.audience;
      
      var options = {
        client: client,
        user: user,
        scope: scope,
        audience: audience
      };
      
      var dreq = aaa.request(options, function(dec) {
      
        function ondecision(result) {
          
          var areq = { scope: scope };
          var ctx = { methods: [ 'password' ] };
          return cb(new MFARequiredError('Multi-factor authentication required', null, areq, user, ctx));
          
          
          if (result === true) {
            var resource = { id: 'http://www.example.com/',
             name: 'Example Service',
             tokenTypes: 
              [ { type: 'application/fe26.2' },
                { type: 'urn:ietf:params:oauth:token-type:jwt',
                  secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd' } ] }
        
            //res.resources = [ resource ]
            // TODO: Get res.resources here
        
            // TODO: Issue real access token.
            /*
            var ctx = {};
            ctx.user = txn.user;
            ctx.client = txn.client;
            ctx.resources = txn.resources;
            ctx.permissions = [ { resource: txn.resources[0], scope: 'foo' } ];
    
            issueToken(ctx, function(err, accessToken) {
              if (err) { return cb(err); }
      
              return cb(null, accessToken);
            });
            */
        
            return cb(null, 'some-access-token-goes-here');
        
            //return cb(null, true, { permissions: [ { resource: resource, scope: 'foo' } ]});
          } else {
            return cb(null, false);
          }
        
          // TODO: Handle indeterminte by prompting?  Or attenuating scope?
          
          
        }
      
        function onprompt(name, options) {
          // TODO: Send errors based on prompt.  Consent is implicit
          
          // case 'login':
          // TODO: MFA Support
          // var areq = { scope: scope };
          // var ctx = { methods: [ 'password' ] };
          // return cb(new MFARequiredError('Multi-factor authentication required', null, areq, user, ctx));
          
          var opts = options || {};
          opts.prompt = name;
          return cb(null, false, opts);
        }
      
        function onend() {
          dec.removeListener('decision', ondecision);
          dec.removeListener('prompt', onprompt);
        }
      
        dec.once('decision', ondecision);
        dec.once('prompt', onprompt);
        dec.once('end', onend);
      });
    
      dreq.on('error', function(err) {
        // TODO:
      })
    
      dreq.send();
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/oauth2/sts',
  'http://schemas.authnomicon.org/js/aaa',
  'http://schemas.authnomicon.org/js/cs/password'
];
