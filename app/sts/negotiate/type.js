exports = module.exports = function() {
  
  // aka, method of utilization
  return function negotiateTokenType(resources, client, cb) {
    if (!Array.isArray(resources)) {
      resources = [ resources ];
    }
    
    // TODO: Initialize types to those supported by AS
    
    var supportedTypes = resources[0].tokenUsagesSupported || [ 'bearer' ]
      , resource, i, len;
    for (i = 1, len = resources.length; i < len; ++i) {
      resource = resources[i];
      if (resource.tokenUsagesSupported) {
        supportedTypes = supportedTypes.filter(function(e) {
          return resource.tokenUsagesSupported.indexOf(e) !== -1;
        });
      }
    }
    
    if (client.tokenUsagesSupported) {
      supportedTypes = supportedTypes.filter(function(e) {
        return client.tokenUsagesSupported.indexOf(e) !== -1;
      });
    }
    
    return cb(null, supportedTypes[0]);
  };
};
