exports = module.exports = function(client) {
  var RedisCodec = require('../../lib/code/redis');
  
  var codec = new RedisCodec(client);
  return codec;
}

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/code/Codec';
exports['@singleton'] = true;
exports['@require'] = [ 'http://i.bixbyjs.org/opt/redis/Client' ];
