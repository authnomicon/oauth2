exports = module.exports = function() {
  
  // aka, method of utilization
  return function negotiateTokenType(resources, client, cb) {
    if (!Array.isArray(resources)) {
      resources = [ resources ];
    }
    
    // TODO: Initialize types to those supported by AS
    
    var supportedTypes = resources[0].tokenUsagesSupported || [ 'bearer' ]
      , resource, i, len;
      
    // Filter the array of supported types to those supported by the resource
    // servers this token will be used to authorize access to.
    for (i = 1, len = resources.length; i < len; ++i) {
      resource = resources[i];
      if (resource.tokenUsagesSupported) {
        supportedTypes = supportedTypes.filter(function(e) {
          return resource.tokenUsagesSupported.indexOf(e) !== -1;
        });
      }
    }
    
    // Filter the array of supported types to those supported by the client that
    // is requesting access to the resource servers.
    if (client.tokenUsagesSupported) {
      supportedTypes = supportedTypes.filter(function(e) {
        return client.tokenUsagesSupported.indexOf(e) !== -1;
      });
    }
    
    return cb(null, supportedTypes[0]);
  };
};
