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
exports = module.exports = function(realms) {
  var oauth2orize = require('oauth2orize')
    , uri = require('url');
  
  return function validateClient(clientID, redirectURI, cb) {
    
    realms.resolve('clients', function(err, realm) {
      if (err) { return cb(err); }
    
      var dir = realm.createDirectory(function() {
        // The directory is ready, continue processing by fetching the client
        // record.
        
        dir.get(clientID, function(err, client) {
          if (err) { return cb(err); }
          if (!client) {
            return cb(new oauth2orize.AuthorizationError('Unknown client', 'unauthorized_client'));
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
      
      
          if (redirectURI) {
            var url = uri.parse(redirectURI);
            //console.log(url);
            if (url.protocol == 'storagerelay:') {
              // TODO: Implement web/js origin checks
              return cb(null, client, redirectURI, 'http://localhost:3001');
            }
          }
      
      
          if (redirectURI && client.redirectURIs.indexOf(redirectURI) == -1) {
            return cb(new oauth2orize.AuthorizationError('Client not permitted to use redirect URI', 'unauthorized_client'));
          }
      
          return cb(null, client, redirectURI || client.redirectURIs[0], 'http://localhost:3001');
        });
      }); // realm.createDirectory(readyListener)
      
      // TODO: Handle dir.on('error')??
      
    }); // realms.resolve
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/realms' ];
