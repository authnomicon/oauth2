exports = module.exports = function(server) {
  
  return function() {
    return server.errorHandler();
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/http/middleware/errorHandler';
exports['@require'] = [
  '../../server'
];
