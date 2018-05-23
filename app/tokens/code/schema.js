exports = module.exports = function(encode, decode) {
  
  return {
    encode: encode,
    decode: decode
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/http/oauth2/tokens/authorization-code/Schema';
exports['@type'] = 'urn:ietf:params:oauth:token-type:jwt';
exports['@require'] = [
  './encode',
  './decode'
];
