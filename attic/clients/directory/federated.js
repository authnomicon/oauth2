exports = module.exports = function(container, logger) {
  var FederatedDirectory = require('digidex').FederatedDirectory;
  
  var directory = new FederatedDirectory();
  
  var specs = container.specs()
    , spec, mech, i, len;
  for (i = 0, len = specs.length; i < len; ++i) {
    spec = specs[i];
    if ((spec.implements || []).indexOf('http://schemas.modulate.io/js/aaa/oauth2/federation/clientMetadataFunc') !== -1) {
      // This spec declares a mechanism for retrieving federated metadata
      // regarding an OAuth 2.0 client.  Create an instance of the mechanism
      // and register it with the directory.
      mech = container.create(spec.id);
      directory.use(mech);
      logger.info('Loaded support for federated OAuth 2.0 client metadata: ' + (mech.name));
    }
  }
  
  return directory;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/clients/Directory';
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
