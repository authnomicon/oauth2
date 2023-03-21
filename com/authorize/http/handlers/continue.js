var aaa = require('triplea');

exports = module.exports = function(prompts, service, server, authenticator, store) {
  
  return [
    // parseCookies(),// TODO: Put this at app level? Why?
    require('flowstate')({ store: store }),
    authenticator.authenticate([ 'session' ], { multi: true }),
    server.resume(
      function(txn, cb) {
        var zreq = new aaa.Request(txn.client, txn.req, txn.user);
        service(zreq, function(err, zres) {
          if (err) { return cb(err); }
          
          if (zres.allow === true) {
            var ares = {};
            ares.scope = zres.grant;
            
            // FIXME: remove this
            ares.issuer = 'http://localhost:8085'
            
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
