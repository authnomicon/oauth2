exports = module.exports = function(prompts, service, server) {
  var oauth2orize = require('oauth2orize');
  var Request = require('../../../../lib/request')
    , Response = require('../../../../lib/response');
  var merge = require('utils-merge');
  
  
  // TODO: Going to need to pass some "select account" function to passport to
  //       select a multi login based on login_hint/id_token/login_ticket
  
  
  return function(req, res, next) {
    var azreq = new Request(req.oauth2.client, req.oauth2.req, req.oauth2.user)
      , azres = new Response();
    
    
    if (req.state.selectedSession) {
      azres.selectedSession = req.state.selectedSession;
    }
    
    
    // FIXME: Normalize this data structure correctly
    if (req.session) {
      azreq.session = {};
      azreq.session.authInfo = req.session.authInfo;
    }
    
    function ondecision(result, scope) {
      // pop state that was pushed by transaction store, if any.
      req.popState();
      req.state.complete();
    
      if (result === true) {
        // TODO: Introduce support for multiple resource servers, scoped individually (UMA, etc)
        //req.oauth2.res = { permissions: [ { resource: { id: 'userinfo' }, scope: scope } ]};
        req.oauth2.res = { allow: true };
        if (scope) { req.oauth2.res.scope = scope; }
        
        // TODO: Ideally use Express's req.hostname here, as it does the trust proxy
        // stuff, but strips the port.   Need to find a solution.
        req.oauth2.res.issuer = req.protocol + '://' + req.headers['host'];
        
        var authContext = merge({}, req.authInfo);
        authContext.sessionID = req.sessionID;
        req.oauth2.res.authContext = authContext;
      
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
      if (azreq.prompt.indexOf('none') != -1) {
        // FIXME: Need to popState here?
        return next(new oauth2orize.AuthorizationError('Interaction required', 'interaction_required'));
      }
      
      /*
      if (name == 'login' && !req.user) {
        console.log('WE CAN JUST REDIRECT HERE!');
      }
      */
      
      // FIXME: Merge rather than overwrite
      res.locals = options || {};
      prompts.dispatch(name, req, res, next);
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
  'http://i.authnomicon.org/prompts/http/Router',
  'http://i.authnomicon.org/oauth2/AuthorizationService',
  '../../../http/server'
];
