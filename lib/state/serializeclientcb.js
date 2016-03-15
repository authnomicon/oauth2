exports = module.exports = function() {
  return function(client, cb) {
    return cb(null, client.id);
  };
};

exports['@provides'] = 'io.modulate.security.oauth2.serializeClientCallback';
exports['@require'] = [];
