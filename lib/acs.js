exports = module.exports = function(client) {
  var RedisACS = require('./_i/acs/redis');
  
  var acs = new RedisACS(client);
  
  return acs;
}

exports['@singleton'] = true;
exports['@require'] = [ 'http://i.bixbyjs.org/redis/Client' ];

exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/ACS';
