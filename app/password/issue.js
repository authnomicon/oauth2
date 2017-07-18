exports = module.exports = function(issueToken, pdp, Resources, AAA, service, verifyPassword) {
  var TokenTransaction = require('klamm-oauth2').TokenTransaction;
  var MFARequiredError = require('oauth2orize-mfa').MFARequiredError;
  
  
  return function issue(client, username, passwd, scope, body, authInfo, cb) {
    console.log('OAUTH 2.0 VERIFY PASSWORD');
    console.log(client)
    console.log(username);
    console.log(passwd);
    console.log(scope);
    console.log(body);
    console.log(authInfo);
    
    verifyPassword(username, passwd, function(err, user) {
      console.log(err);
      console.log(user);
      
      console.log('process txn...');
      
      
      function respond() {
        console.log('TOKEN PASSOWRD RESPOND!');
        console.log(this);
        
        if (this.allowed === undefined) {
          console.log('TODO: PROMPT, SEND ERROR WITH TOKEN?');
          
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
      
      var txn = new TokenTransaction(client, areq, user, respond);
      service(txn);
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
  'http://schema.modulate.io/js/aaa/PolicyDecisionPoint',
  'http://schemas.modulate.io/js/aaa/services/Directory',
  'http://schemas.modulate.io/js/aaa',
  'http://schemas.authnomicon.org/js/aaa/Service',
  'http://i.bixbyjs.org/security/authentication/password/authenticate'
];
