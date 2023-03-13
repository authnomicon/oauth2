var express = require('express');

/**
 * OAuth 2.0 token service.
 *
 * This component provides an HTTP service that implements the OAuth 2.0 [token
 * endpoint][1]. The token endpoint is used by clients to obtain an access token
 * by presenting an authorization grant.  An authorization grant is a credential
 * representing the resource owner's authorization.
 *
 * OAuth 2.0 defines an extensible framework which supports multiple types of
 * authorization grants.  Most commonly, the grant will be an authorization
 * code, which is obtained by redirecting the resource owner to the
 * authorization server's authorization endpoint.  The authorization server is
 * an intermediary between the client and the resource owner, and interacts with
 * the resource owner to obtain authentication and authorization.  This grant
 * has a number of beneficial security properties, including not exposing the
 * resource owner's credentials to the client.
 *
 * In cases where having the authorization server intermediate is not possible
 * or not desired, clients with direct access to resource owner credentials
 * (i.e., username and password) can use those credentials as a grant to obtain
 * an access token.  Such grants should only be used when there is a high degree
 * of trust between the resource owner and the client.
 *
 * This service is annotated with a type of `oauth2-token`, which is the
 * [proposed][2] [link relation][3] for the token endpoint.  This value is
 * suitable for registering the service in a service registry.
 *
 * [1]: https://tools.ietf.org/html/rfc6749#section-3.2
 * [2]: https://tools.ietf.org/html/draft-wmills-oauth-lrdd-07#section-3.2
 * [3]: https://tools.ietf.org/html/rfc5988#section-4
 */
exports = module.exports = function(tokenHandler) {
  var router = express.Router();
  router.post('/', tokenHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@type'] = 'oauth2-token';
exports['@path'] = '/oauth2/token';
exports['@require'] = [
  './handlers/token'
];
