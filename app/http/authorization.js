exports = module.exports = function(authorizeHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/authorize', authorizeHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/AuthorizationService';
exports['@require'] = [
  './handlers/authorize'
];
