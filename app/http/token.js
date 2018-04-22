exports = module.exports = function(tokenHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.post('/', tokenHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/TokenService';
exports['@require'] = [
  './handlers/token'
];
