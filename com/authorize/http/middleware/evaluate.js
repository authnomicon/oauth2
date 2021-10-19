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
      // TODO: Replace this with prompts.dispatch(name,...)
      var prompt = prompts.get(name);
      if (!prompt) { return next(new Error("Unknown prompt '" + name + "'")); }
      
      // FIXME: Merge rather than overwrite
      res.locals = options || {};
      prompt(req, res, next);
    }
  
    function onend() {
      azres.removeListener('decision', ondecision);
      azres.removeListener('__prompt__', onprompt);
    }
  
    azres.once('decision', ondecision);
    azres.once('__prompt__', onprompt);
    azres.once('end', onend);
  
    service(azreq, azres);
  };
};

exports['@require'] = [
  'http://i.authnomicon.org/prompts/http/Registry',
  'http://i.authnomicon.org/oauth2/AuthorizationService',
  '../../../http/server'
];
