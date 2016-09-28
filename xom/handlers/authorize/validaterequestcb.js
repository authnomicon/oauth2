/**
 * OAuth 2.0 request validation.
 *
 * 
 */
exports = module.exports = function(directory) {
  var oauth2orize = require('oauth2orize');
  
  // purpose of this it to verify the redirect URI in the request, so we are not an open redirector
  // Implements 3.1.2.4.  Invalid Endpoint
  
  return function validateRequest(clientID, redirectURI, cb) {
    directory.get(clientID, function(err, client) {
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
      if (redirectURI && client.redirectURIs.indexOf(redirectURI) == -1) {
        return cb(new oauth2orize.AuthorizationError('Client not permitted to use redirect URI', 'unauthorized_client'));
      }
      
      return cb(null, client, redirectURI || client.redirectURIs[0]);
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/clients/Directory' ];
