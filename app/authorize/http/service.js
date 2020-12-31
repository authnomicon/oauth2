/**
 * OAuth 2.0 authorization service.
 *
 * This component provides an HTTP service that implements the OAuth 2.0
 * [authorization endpoint][1]. The authorization endpoint is used to interact
 * with the resource owner in order to obtain an authorization grant.
 *
 * Interaction with the resource owner consists of a sequence of prompts,
 * including login and consent.  This sequence of prompts is known as a
 * transaction.  After the user responds to a prompt, the transaction continues,
 * resulting in further prompts until the transaction is approved, in which case
 * access is granted, or denied.
 *
 * Transactions are continued via the "continue" endpoint, which is also
 * implemented by this service.  In contrast to the authorization endpoint,
 * which implements an industry standard protocol and is publicly available for
 * use by clients to initiate authorization, the continue endpoint is used
 * internally by the authorization server itself to continue the transaction
 * initiated by the client.  Transactions are stateful, with each subsequent
 * prompt returning the state necessary to resume authorization processing.
 *
 * This service is annotated with a type of `oauth2-authorize`, which is the
 * [proposed][2] [link relation][3] for the authorization endpoint.  This value
 * is suitable for registering the service in a service registry.
 *
 * [1]: https://tools.ietf.org/html/rfc6749#section-3.1
 * [2]: https://tools.ietf.org/html/draft-wmills-oauth-lrdd-07#section-3.1
 * [3]: https://tools.ietf.org/html/rfc5988#section-4
 */

/*
* It is recommended that desktop and mobile applications delegate
* authentication to a sign-in service, making use of web views to allow the
* service to present login prompts to end-users.  This allows the service to
* dynamically change the sequence of challenges presented to the end-user,
* in order to obtain the desired security posture without deploying software
* updates to end-user systems.  This technique also avoids exposing the
* end-user's credentials to the application.  The sign-in service would
* implement a protocol such as OpenID Connect, and make use of this password
* authentication service as one of its prompts.
*
* Despite this recommendation, it is acknowledged that desktop and mobile
* applications continue to present native login screens, directly handling end-
* user credentials and thus creating a tight coupling between the challenges
* supported and the attainable security posture.  Such applications do not
* delegate to a sign-in service and should not make use of this service.
* Instead, applications are encouraged to make use of the the [HTTP
* Authentication][1] framework, perhaps in conjuction with the [OAuth 2.0][2]
* authorization framework and end-user credentials as authorization grants.
 *
 * [1]: https://tools.ietf.org/html/rfc7235
 * [2]: https://tools.ietf.org/html/rfc6749
*/
exports = module.exports = function(authorizeHandler, continueHandler) {
  var express = require('express');
  
  var router = new express.Router();
  router.get('/', authorizeHandler);
  router.get('/continue', continueHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@relation'] = 'oauth2-authorize';
exports['@path'] = '/oauth2/authorize';
exports['@require'] = [
  './handlers/authorize',
  './handlers/continue'
];
