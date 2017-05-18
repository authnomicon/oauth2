exports = module.exports = function(tokenHandler) {
  var express = require('express');
  var router = new express.Router();
  
  router.get('/token', tokenHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/http/TokenService';
exports['@require'] = [
  '../handlers/token'
];
