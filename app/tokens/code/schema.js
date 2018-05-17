exports = module.exports = function(encode) {
  
  return {
    encode: encode,
    decode: decode
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/security/tokens/Schema';
exports['@type'] = 'http://schemas.authnomicon.org/oauth/token/authorization-code';
exports['@schema'] = 'http://schemas.authnomicon.org/jwt/authorization-code';
exports['@require'] = [
  './encode'
];
