exports = module.exports = function(OAuth2, validateClient, server, authenticate, ceremony) {
  var Request = require('../../../lib/request')
    , Response = require('../../../lib/response');
  
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  //return ceremony('/oauth2/authorize',
  return ceremony(
    authenticate([ 'session', 'anonymous' ]),
    server.authorization(
      validateClient,
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    function(req, res, next) {
      console.log('OAUTH2 AUTHORIZE!!!!');
      console.log(req.oauth2)
      //return
      
      var o2req = new Request(req.oauth2.client, req.oauth2.user)
        , o2res = new Response();
      
      
      function ondecision(result, scope) {
        console.log('ON DECISION!!!');
        console.log(result);
        console.log(scope)
        console.log(req.oauth2)
        
        if (result === true) {
          // FIXME: Normalize this better
          req.oauth2.res = { permissions: [ { resource: { id: 'userinfo' }, scope: scope } ]};
          req.oauth2.res.allow = true;
          
          server._respond(req.oauth2, res, function(err) {
            if (err) { return next(err); }
            return next(new AuthorizationError('Unsupported response type: ' + req.oauth2.req.type, 'unsupported_response_type'));
          });
          
          
          
          //return cb(null, true, { permissions: [ { resource: resource, scope: scope } ]});
        } else {
          //return cb(null, false);
        }
      }
      
      function onprompt(name, options) {
        console.log('ON PROMPTs!!!');
        console.log(name);
        console.log(options)
        
        
        // TODO: look up a service to handle the prompt (OIDC for login, etc)
        switch (name) {
        case 'login':
          return res.redirect('/login/password');
        }
        
        
        //var opts = options || {};
        //opts.prompt = name;
        //return cb(null, false, opts);
      }
      
      function onend() {
        console.log('ON END!...');
        
        o2res.removeListener('decision', ondecision);
        o2res.removeListener('_prompt', onprompt);
      }
      
      o2res.once('decision', ondecision);
      o2res.once('_prompt', onprompt);
      o2res.once('end', onend);
      
      OAuth2.authorize(o2req, o2res);
      
      
      //return next();
      
      //res.redirect('/login/password');
    },
  { external: true });
};

exports['@require'] = [
  'http://i.authnomicon.org/oauth2/OAuth2Service',
  './authorize/validateclient',
  '../../server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
