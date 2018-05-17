exports = module.exports = function(container, issue, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var components = container.components('http://schemas.authnomicon.org/js/http/oauth2/ResponseMode');
  return Promise.all(components.map(function(comp) { return comp.create(); } ))
    .then(function(plugins) {
      var modes = {}
        , name;
      plugins.forEach(function(mode, i) {
        name = components[i].a['@mode'];
        modes[name] = mode;
        logger.info('Loaded response mode for OAuth 2.0 authorization code grant: ' + name);
      });
      
      return oauth2orize.grant.code({
        modes: modes
      }, issue);
    });
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/Grant';
exports['@type'] = 'code';
exports['@require'] = [
  '!container',
  './issue/code',
  'http://i.bixbyjs.org/Logger'
];
