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
        // `redirectURIs` is an optional property, and may not be present on
        // on clients that do not use flows with redirection.  Such clients are
        // not authorized to use the `/authorize` endpoint.
        return cb(new oauth2orize.AuthorizationError('Client has no registered redirect URIs', 'unauthorized_client'));
      }
      
      // TODO: Implement 3.1.2.2.  Registration Requirements
      /*
      The authorization server MUST require the following clients to
      register their redirection endpoint:

      o  Public clients.

      o  Confidential clients utilizing the implicit grant type.
      */
      
      // TODO: Implement 3.1.2.3.  Dynamic Configuration
      /*
      If multiple redirection URIs have been registered, if only part of
      the redirection URI has been registered, or if no redirection URI has
      been registered, the client MUST include a redirection URI with the
      authorization request using the "redirect_uri" request parameter.
      */
      
      // TODO: Validate this stuff
      var locals = {}
      
      // TODO: Will need to special case support for storagerelay URLs
      // TODO: Always set webOrigin, if client has that property.  Dont' base it
      //       on response mode.
      //if (areq.responseMode == 'web_message') {
        // https://tools.ietf.org/html/rfc6454
        // TODO: Validate these things.
        //locals.webOrigin = 'http://127.0.0.1:3001';
        //locals.webOrigin = 'http://localhost:3001';
      //}
      
      
      // FIXME: Temp hack, remove
      return cb(null, client, redirectURI, locals);
      
      if (!redirectURI) {
        // If the request did not explicitly specify a redirect URI, use the
        // higest priority URI specified in the client's registration.
        redirectURI = client.redirectURIs[0];
      } else if (client.redirectURIs.indexOf(redirectURI) == -1) {
        return cb(new oauth2orize.AuthorizationError('Client not allowed to use redirect URI: ' + redirectURI, 'unauthorized_client'));
      }
      
      return cb(null, client, redirectURI, locals);
    });
  };
};

exports['@require'] = [ 'http://schemas.modulate.io/js/aaa/clients/Directory' ];
