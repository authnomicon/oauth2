exports = module.exports = function(processRequest, Clients, server, authenticate, ceremony) {
  var oauth2orize = require('oauth2orize')
    , uri = require('url');
  
  
  return ceremony(
    authenticate([ 'session', 'anonymous' ]),
    server.authorization(
      function validateClient(clientID, redirectURI, cb) {
    
        Clients.find(clientID, function(err, client) {
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

          // http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html
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
    
          return cb(null, client, redirectURI || client.redirectURIs[0]);
        }); // ds.get
      },
      function(txn, cb) {
        // Immediate mode callback.  Always, false, deferring transaction processing to 
        // HTTP handler below where all context is available.
        return cb(null, false);
      }
    ),
    processRequest,
  { external: true, continue: '/oauth2/authorize/continue' });
};

exports['@require'] = [
  './authorize/process',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  '../../../http/server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
