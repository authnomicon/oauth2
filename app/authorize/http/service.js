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
