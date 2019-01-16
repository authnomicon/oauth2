exports = module.exports = function(tokenHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/', tokenHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/token';
exports['@require'] = [
  './handlers/token'
];
