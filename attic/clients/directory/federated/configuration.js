exports = module.exports = function(WWW) {
  return require('oauth2-client-configuration')({ request: WWW });
};

exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/federation/clientMetadataFunc';
exports['@require'] = [ 'http://i.bixbyjs.org/www/Client' ];
