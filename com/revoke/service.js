var express = require('express');

exports = module.exports = function(revokeHandler) {
  var router = express.Router();
  router.post('/', revokeHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/revoke';
exports['@require'] = [
  './handlers/revoke'
];
