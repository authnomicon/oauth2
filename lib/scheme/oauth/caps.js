// TODO: Should plaintext or none be listed in signing algs??  If so,
//       how is session key encoded in confirmation??
exports = module.exports = {
  signingAlgorithms: [
    'hmac-sha1', 'rsa-sha1'
  ]
};

exports['@literal'] = true;
exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/token/capabilitiesDesc';
exports['@type'] = [ 'oauth' ];
