exports = module.exports = function() {
  return function(client, cb) {
    return cb(null, client.id);
  };
};

exports['@require'] = [];
