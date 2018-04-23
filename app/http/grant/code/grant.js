exports = module.exports = function(container, issue, logger) {
  var oauth2orize = require('oauth2orize');
  
  
  var modeComps = container.components('http://schemas.authnomicon.org/js/oauth2/responseMode');
  return Promise.all(modeComps.map(function(spec) { return container.create(spec.id); } ))
    .then(function(plugins) {
      var modes = {}
        , name;
      plugins.forEach(function(mode, i) {
        name = modeComps[i].a['@mode'];
        modes[name] = mode;
        logger.info('Loaded response mode for OAuth 2.0 authorization code flow: ' + name);
      });
      
      return oauth2orize.grant.code({
        modes: modes
      }, issue);
    });
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/responseType';
exports['@type'] = 'code';
exports['@require'] = [
  '!container',
  './issue/code',
  'http://i.bixbyjs.org/Logger'
];
