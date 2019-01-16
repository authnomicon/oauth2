exports = module.exports = function(authorizeHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/', authorizeHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/authorize';
exports['@require'] = [
  './handlers/authorize'
];
