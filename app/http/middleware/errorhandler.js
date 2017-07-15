exports = module.exports = function(server) {
  
  return function() {
    return server.errorHandler();
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/middleware/errorHandler';
exports['@require'] = [
  '../../server'
];
