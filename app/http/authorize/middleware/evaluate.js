exports = module.exports = function(prompts, service, server) {
  var Request = require('../../../../lib/request')
    , Response = require('../../../../lib/response');
  
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  
  return function(req, res, next) {
    var azreq = new Request(req.oauth2.client, req.oauth2.user)
      , azres = new Response();
    
    // FIXME: Normalize this data structure correctly
    if (req.session) {
      azreq.session = {};
      azreq.session.authInfo = req.session.authInfo;
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
      var prompt;
      try {
        prompt = prompts.get(name);
      } catch (ex) {
        return next(ex);
      }
      
      // FIXME: Merge rather than overwrite
      res.locals = options || {};
      prompt(req, res, next);
    }
  
    function onend() {
      azres.removeListener('decision', ondecision);
      azres.removeListener('_prompt', onprompt);
    }
  
    azres.once('decision', ondecision);
    // lres.once('__challenge__', onchallenge);
    azres.once('_prompt', onprompt);
    azres.once('end', onend);
  
    service(azreq, azres);
  };
};

exports['@require'] = [
  'http://i.authnomicon.org/http/prompt/Registry',
  'http://i.authnomicon.org/oauth2/Listener',
  '../../server'
];
