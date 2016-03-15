exports = module.exports = {
  signingAlgorithms: [
    'hmac-sha1', 'hmac-sha256'
  ]
};

exports['@literal'] = true;
exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/token/capabilitiesDesc';
exports['@type'] = [ 'mac' ];
