exports = module.exports = function(createHandler) {
  var express = require('express');
  
  var router = new express.Router();
  router.post('/', createHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/client';
exports['@require'] = [
  './handlers/create'
];
