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
 * [1]: https://tools.ietf.org/html/rfc6749#section-3.1
 */
exports = module.exports = function(authorizeHandler, continueHandler) {
  var express = require('express');
  
  var router = new express.Router();
  router.get('/', authorizeHandler);
  router.get('/continue', continueHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@type'] = 'oauth2-authorize';
exports['@path'] = '/oauth2/authorize';
exports['@require'] = [
  './handlers/authorize',
  './handlers/continue'
];
