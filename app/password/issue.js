exports = module.exports = function(issueToken, aaa, pdp, Resources, AAA, service, verifyPassword) {
  var MFARequiredError = require('oauth2orize-mfa').MFARequiredError;
  //var klamm = require('klamm-oauth2');
  
  
  return function issue(client, username, passwd, scope, body, authInfo, cb) {
    console.log('OAUTH 2.0 VERIFY PASSWORD');
    console.log(client)
    console.log(username);
    console.log(passwd);
    console.log(scope);
    console.log(body);
    console.log(authInfo);
    
    verifyPassword(username, passwd, function(err, user) {
      console.log('PASSWORD VERIFIED');
      console.log(err);
      console.log(user);
      
      var audience = body.audience;
      
      var options = {
        client: client,
        user: user,
        scope: scope,
        audience: audience
      };
      
      var req = aaa.request(options, function(res) {
        console.log(res);
      
        function ondecision(result) {
          if (result === true) {
            var resource = { id: 'http://www.example.com/',
             name: 'Example Service',
             tokenTypes: 
              [ { type: 'application/fe26.2' },
                { type: 'urn:ietf:params:oauth:token-type:jwt',
                  secret: 'some-shared-with-rs-s3cr1t-asdfasdfaieraadsfiasdfasd' } ] }
        
            //res.resources = [ resource ]
            // TODO: Get res.resources here
        
            return cb(null, 'some-access-token-goes-here');
        
            //return cb(null, true, { permissions: [ { resource: resource, scope: 'foo' } ]});
          } else {
            return cb(null, false);
          }
        
          // TODO: Handle indeterminte by prompting?  Or attenuating scope?
        }
      
        function onprompt(name, options) {
          // TODO: Send errors based on prompt.  Consent is implicit
          
          var opts = options || {};
          opts.prompt = name;
          return cb(null, false, opts);
        }
      
        function onend() {
          res.removeListener('decision', ondecision);
          res.removeListener('prompt', onprompt);
        }
      
        res.once('decision', ondecision);
        res.once('prompt', onprompt);
        res.once('end', onend);
      });
    
      req.on('error', function(err) {
        // TODO:
      })
    
      req.send();
    });
    
    return;
    
    
    verifyPassword(username, passwd, function(err, user) {
      console.log(err);
      console.log(user);
      
      console.log('process txn...');
      
      
      function respond() {
        console.log('TOKEN PASSOWRD RESPOND!');
        console.log(this);
        
        if (this.allowed === undefined) {
          var areq = { scope: scope };
          var ctx = { methods: [ 'password' ] };
          
          console.log('TODO: PROMPT, SEND ERROR WITH TOKEN?');
          console.log(this.prompt);
          
          switch (this.prompt.prompt) {
          case 'login':
            // TODO: Pass additional request context needed here to make mfa_token
            return cb(new MFARequiredError('Multi-factor authentication required', null, areq, user, ctx));
            break;
            
          default:
            console.log('TODO: Unsupported prompt');
            console.log(this.prompt);
            break;
          }
          
          
          //return cb(null, false, this.prompt);
        } else if (this.allowed == false) {
          console.log('DENY IT');
        } else {
          console.log('ALLOW IT!');
          
          // TODO: Compute the scopes to put in the access token somehow, with grant etc.
          //return cb(null, true, { permissions: [ { resource: txn.resources[0], scope: 'foo' } ]});
          
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
        }
        
      }
      
      
      // TODO: Parse body for scope, audience, etc...
      var areq = {
        scope: scope
      };
      
      var req = new klamm.TokenRequest(client, areq);
      var txn = new klamm.TokenTransaction(user, respond);
      service(req, txn);
    });
    
    
    
    return;
    
    verifyPassword(username, passwd, function(err, user) {
      console.log(err);
      console.log(user);
      
      if (err) { return cb(err); }
      
      
      var opts = {
        audience: body.audience,
        resource: body.resource,
        scope: scope,
      };
      
      AAA.inferResources(opts, function(err, rids) {
        console.log(err);
        console.log(rids);
        
        if (err) { return cb(err); }
        
        Resources.fetch(rids, function(err, resources) {
          console.log(err);
          console.log(resources);
          
          // TODO: How to evaluate policies of multiple resources?
          pdp.eval(user, resources[0], client, function(err, decision, info) {
            console.log('EVAL!');
            console.log(err);
            console.log(decision);
            console.log(info);
            
            
            return cb(new MFARequiredError('Multi-factor authentication required', null, user));
            
            
            var ctx = {};
            ctx.user = user;
            ctx.client = client;
            ctx.resources = resources;
            ctx.permissions = [ { resource: resources[0], scope: decision.allowed } ];
            
            issueToken(ctx, function(err, accessToken) {
              if (err) { return cb(err); }
              
              return cb(null, accessToken);
            });
          });
        });
      });
    }); // verifyPassword
  };
};

exports['@require'] = [
  '../util/issuetoken',
  'http://schemas.authnomicon.org/js/aaa',
  'http://schema.modulate.io/js/aaa/PolicyDecisionPoint',
  'http://schemas.modulate.io/js/aaa/realms',
  'http://schemas.modulate.io/js/aaa',
  'http://schemas.authnomicon.org/js/aaa/Service',
  'http://schemas.authnomicon.org/js/security/authentication/password/verifyFn'
];
