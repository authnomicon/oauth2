exports = module.exports = function(password) {

  return function(clientID, secret, cb) {
    password.verify(clientID, secret, 'clients', function(err, client, info) {
      return cb(err, client, info)
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/cs/password'
];
