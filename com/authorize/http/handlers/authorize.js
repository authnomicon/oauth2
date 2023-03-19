var aaa = require('triplea');

/**
 * OAuth 2.0 request validation.
 *
 * This component provides a function that validates a client's authorization
 * request.  If the request is valid, the function yeilds a `client` object and
 * a `redirectURI`.  The client object provides metadata about the client, such
 * as name and logo, used during processing of the authorization request.  The
 * redirect URI is used when responding to the authorization request via HTTP
 * redirections.
 *
 * If the request is invalid, the function yeilds an error.  It is expected that
 * the application will inform the user of the error, and must not automatically
 * redirect the user to an invalid redirection URI.
 */

exports = module.exports = function(prompts, service, clients, server, authenticator, store, logger, C) {
  var oauth2orize = require('oauth2orize')
    , url = require('url');
  
  
  return Promise.resolve(null)
    .then(function() {
      var resolvers = {};
      
      return new Promise(function(resolve, reject) {
        var components = C.components('module:@authnomicon/oauth2.resolveRedirectURISchemeFn')
          , scheme;
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(resolvers);
          }
          
          scheme = component.a['@scheme'];
          
          component.create()
            .then(function(resolver) {
              logger.info("Loaded redirect URI scheme '" + scheme +  "'");
              resolvers[scheme] = resolver;
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load redirect URI scheme:\n';
              msg += err.stack;
              logger.warning(msg);
              iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(resolvers) {

      return [
        //parseCookies(), // TODO: Put this at app level? Why?
        //state({ external: true }),
        require('flowstate')({ external: true, store: store }),
        authenticator.authenticate([ 'session', 'anonymous' ], { multi: true }),
        server.authorization(
          function validateClient(clientID, redirectURI, cb) {
            clients.read(clientID, function(err, client) {
              if (err) { return cb(err); }
              if (!client) {
                return cb(new oauth2orize.AuthorizationError('Unauthorized client', 'unauthorized_client'));
              }
              
              var responseURIs = [].concat(client.redirectURIs || [])
                                   .concat(client.webOrigins || []);
              if (responseURIs.length == 0) {
                // The client has not registered any redirection endpoints.  Such
                // clients are not authorized to use the authorization endpoint.
                //
                // This enforcement is in place in order to prevent the authorization
                // server from functioning as an open redirector.  Refer to Section
                // 3.1.2.2 of RFC 6749 for further details.
                return cb(new oauth2orize.AuthorizationError('Client has no registered redirect URIs', 'unauthorized_client'));
              }
              if (responseURIs.length > 1 && !redirectURI) {
                // If multiple redirection URIs have been registered, the client must
                // include a redirection URI with the authorization request.  Refer to
                // Section 3.1.2.3 of RFC 6749 for further details.
                return cb(new oauth2orize.AuthorizationError('Missing required parameter: redirect_uri', 'invalid_request'));
              }

              // WIP: clean this up
              var responseURI = redirectURI || responseURIs[0]
                , uri = url.parse(responseURI)
                , scheme = uri.protocol.slice(0, -1)
                , resolver = resolvers[scheme]
                , rtoRedirectURI, rtoWebOrigin;
                
              if (resolver) {
                responseURI = resolver(responseURI);
                redirectURI = responseURI;
              }


              if (redirectURI && responseURIs.indexOf(redirectURI) == -1) {
                return cb(new oauth2orize.AuthorizationError('Client not permitted to use redirect URI', 'unauthorized_client'));
              }
              
              if (client.redirectURIs && client.redirectURIs.indexOf(responseURI) !== -1) {
                rtoRedirectURI = responseURI;
              }
              if (client.webOrigins && client.webOrigins.indexOf(responseURI) !== -1) {
                rtoWebOrigin = responseURI;
              }
              // FIXME: proper web origin support
              //worig = 'http://localhost:3001';
              return cb(null, client, rtoRedirectURI, rtoWebOrigin);
            }); // clients.read
          },
          function(txn, cb) {
            console.log('EVAL TRANSACTION');
            console.log(txn);
            
            var zreq = new aaa.Request(txn.client, txn.req, txn.user);
            service(zreq, function(err, zres) {
              if (err) { return cb(err); }
              
              if (zres.allow === true) {
                var ares = {};
                ares.scope = zres.grant;
                
                // FIXME: remove this
                ares.issuer = 'http://localhost:8085'
                
                console.log('ARES:');
                console.log(ares);
                
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
                console.log('TODO: prompting...');
                console.log(zres);
                
                //var aprompt = {};
                //aprompt.name = zres.prompt;
                
                return cb(null, false, { prompt: zres.prompt, params: zres.params });
              }
            });
            
            return;
            
            
            // TODO: Filter out "internal" response modes by erroring here?
        
            // Immediate mode callback.  Always, false, deferring transaction processing to 
            // HTTP handler below where all context is available.
            return cb(null, false);
          }
        ),
        function(req, res, next) {
          console.log('NEED TO PROMPT!!!');
          console.log(req.oauth2)
          
          // FIXME: Put this back
          /*
      if (azreq.prompt.indexOf('none') != -1) {
        // FIXME: Need to popState here?
        return next(new oauth2orize.AuthorizationError('Interaction required', 'interaction_required'));
      }
          */
          
          // FIXME: Merge rather than overwrite
          res.locals = req.oauth2.info.params || {};
          prompts.dispatch(req.oauth2.info.prompt, req, res, next);
        },
        // TODO: Add error handling middleware here
        // TODO: Check that this is right and not reloading the txn
        server.authorizationError()
      ];
  
    });
};

exports['@require'] = [
  'http://i.authnomicon.org/prompts/http/Router',
  'http://i.authnomicon.org/oauth2/AuthorizationService',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  '../../../http/server',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
