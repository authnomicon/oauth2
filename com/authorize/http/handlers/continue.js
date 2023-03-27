var aaa = require('aaatrio');

exports = module.exports = function(prompts, service, server, authenticator, store) {
  
  return [
    // parseCookies(),// TODO: Put this at app level? Why?
    require('flowstate')({ store: store }), // WIP: require state
    authenticator.authenticate([ 'session' ], { multi: true }),
    function(req, res, next) {
      if (req.query.select_session) {
        // TODO: Does this interfere with immediate responses completing state?  Check it out.
        req.state.selectSession = req.query.select_session;
      }
      next();
    },
    server.resume(
      function(txn, cb) {
        var zreq = new aaa.Request(txn.client);
        zreq.user = txn.user;
        zreq.prompts = txn.req.prompt;
        
        var zctx = {};
        zctx.selectedSession = txn.ctx.selectedSession || false;
        
        service(zreq, zctx, function(err, zres) {
          if (err) { return cb(err); }
          
          if (zres.allow === true) {
            var ares = {};
            ares.scope = zres.grant;
            
            // FIXME: remove this
            ares.issuer = 'http://localhost:8085'
            //ares.issuer = 'http://localhost:3000'
            
            /*
            // TODO: put a normalized grant on here, if it exists
            // TODO: normalize this into standard grant object.
            // https://openid.bitbucket.io/fapi/oauth-v2-grant-management.html
            //if (Array.isArray(zres.grant) // TODO: check for array of strings only.
            
            grant.scopes = [ { scope: zres.grant } ];
            console.log(grant)
            */
            
            return cb(null, true, ares);
          } else {
            return cb(null, false, { prompt: zres.prompt, params: zres.params });
          }
        });
      },
      function(req, txn, cb) {
        req.state.complete();
        process.nextTick(cb);
      }
    ),
    function prompt(req, res, next) {
      req.params = req.oauth2.info.params || {};
      prompts.dispatch(req.oauth2.info.prompt, req, res, next);
    },
    // TODO: Add error handling middleware here
  ];
};

exports['@require'] = [
  'http://i.authnomicon.org/prompts/http/Router',
  'http://i.authnomicon.org/oauth2/AuthorizationService',
  '../../../http/server',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
