exports = module.exports = function(service, server) {
  var Request = require('../../../../../lib/request')
    , Response = require('../../../../../lib/response');
  
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  
  return function(req, res, next) {
    var areq = new Request(req.oauth2.client, req.oauth2.user)
      , ares = new Response();
    
    if (req.session) {
      areq.session = {};
      areq.session.authInfo = req.session.authInfo;
    }
    
    function ondecision(result, scope) {
      req.state.complete();
    
      if (result === true) {
        // TODO: Introduce support for multiple resource servers, scoped individually (UMA, etc)
        //req.oauth2.res = { permissions: [ { resource: { id: 'userinfo' }, scope: scope } ]};
        req.oauth2.res = { scope: scope };
        req.oauth2.res.allow = true;
      
        server._respond(req.oauth2, res, function(err) {
          if (err) { return next(err); }
          return next(new AuthorizationError('Unsupported response type: ' + req.oauth2.req.type, 'unsupported_response_type'));
        });
      } else {
        
        // TODO: Handle the false case, which should never occur
        //return cb(null, false);
      }
    }
  
    function onprompt(name, options) {
      // TODO: look up a service to handle the prompt (OIDC for login, etc)
      switch (name) {
      case 'login':
        return res.redirect('/login');
      case 'otp-2f':
        return res.redirect('/login/otp-2f');
      case 'publickey':
        return res.redirect('/login/publickey');
      default:
        return next(new Error('Unsupported login challenge: ' + name));
      }
    }
  
    function onend() {
      ares.removeListener('decision', ondecision);
      ares.removeListener('_prompt', onprompt);
    }
  
    ares.once('decision', ondecision);
    // lres.once('__challenge__', onchallenge);
    ares.once('_prompt', onprompt);
    ares.once('end', onend);
  
    service(areq, ares);
  };
};

exports['@require'] = [
  'http://i.authnomicon.org/oauth2/Listener',
  '../../../../http/server'
];
