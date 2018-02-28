exports = module.exports = function(verifyPassword) {

  return function(clientID, secret, cb) {
    verifyPassword(clientID, secret, 'clients', function(err, client, info) {
      return cb(err, client, info)
    });
  };
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/security/authentication/password/verifyFn'
];
