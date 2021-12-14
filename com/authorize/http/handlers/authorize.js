
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

exports = module.exports = function(evaluate, clients, server, authenticate, state, session, parseCookies, logger, C) {
  var oauth2orize = require('oauth2orize')
    , url = require('url');
  
  
  return Promise.resolve(null)
    .then(function() {
      var schemes = {};
      
      return new Promise(function(resolve, reject) {
        var components = C.components('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme')
          , key;
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(schemes);
          }
          
          key = component.a['@scheme'];
          
          component.create()
            .then(function(mode) {
              logger.info("Loaded redirect URI scheme '" + key +  "'");
              schemes[key] = mode;
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load redirect URI scheme:\n';
              msg += err.stack;
              logger.warning(msg);
              return iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(schemes) {

      return [
        parseCookies(),
        session(),
        state({ external: true }),
        authenticate([ 'session', 'anonymous' ], { multi: true }),
        server.authorization(
          function validateClient(clientID, redirectURI, cb) {
    
            clients.read(clientID, function(err, client) {
              if (err) { return cb(err); }
              if (!client) {
                return cb(new oauth2orize.AuthorizationError('Unauthorized client', 'unauthorized_client'));
              }
              
              if (!client.redirectURIs || !client.redirectURIs.length) {
                // The client has not registered any redirection endpoints.  Such
                // clients are not authorized to use the authorization endpoint.
                //
                // This enforcement is in place in order to prevent the authorization
                // server from functioning as an open redirector.  Refer to Section
                // 3.1.2.2 of RFC 6749 for further details.
                return cb(new oauth2orize.AuthorizationError('Client has no registered redirect URIs', 'unauthorized_client'));
              }
              if (client.redirectURIs.length > 1 && !redirectURI) {
                // If multiple redirection URIs have been registered, the client must
                // include a redirection URI with the authorization request.  Refer to
                // Section 3.1.2.3 of RFC 6749 for further details.
                return cb(new oauth2orize.AuthorizationError('Missing required parameter: redirect_uri', 'invalid_request'));
              }

              var ruri = redirectURI || client.redirectURIs[0];
              
              var uri = url.parse(ruri);
              var proto = uri.protocol.slice(0, -1);
              var scheme = schemes[proto];
              var v;
              
              if (scheme) {
                v = scheme.verify(client, redirectURI);
                if (!v) {
                  return cb(new oauth2orize.AuthorizationError('Client not permitted to use redirect URI', 'unauthorized_client'));
                }
                
                return cb(null, client, v[0], v[1]);
              }

              // WIP
              /*
              // http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html
              if (redirectURI) {
                var url = uri.parse(redirectURI);
                //console.log(url);
                if (url.protocol == 'storagerelay:') {
                  // TODO: Implement web/js origin checks
                  return cb(null, client, redirectURI, 'http://localhost:3001');
                }
              }
              */


              if (redirectURI && client.redirectURIs.indexOf(redirectURI) == -1) {
                return cb(new oauth2orize.AuthorizationError('Client not permitted to use redirect URI', 'unauthorized_client'));
              }
    
              return cb(null, client, redirectURI || client.redirectURIs[0]);
            }); // clients.read
          },
          function(txn, cb) {
            // TODO: Filter out "internal" response modes by erroring here?
        
            // Immediate mode callback.  Always, false, deferring transaction processing to 
            // HTTP handler below where all context is available.
            return cb(null, false);
          }
        ),
        evaluate,
        // TODO: Add error handling middleware here
        // TODO: Check that this is right and not reloading the txn
        server.authorizationError()
      ];
  
  });
};

exports['@require'] = [
  '../middleware/evaluate',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  '../../../http/server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state',
  'http://i.bixbyjs.org/http/middleware/session',
  'http://i.bixbyjs.org/http/middleware/parseCookies',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
