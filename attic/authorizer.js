exports = module.exports = function(container) {
  // Load modules.
  var visa = require('visa');
  
  
  var authorizer = new visa.Authorizer();
  return authorizer;
}

exports['@singleton'] = true;
exports['@require'] = [ '!container' ];
exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/Authorizer';
