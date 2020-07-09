exports = module.exports = function(encode, decode) {
  
  return {
    encode: encode,
    decode: decode
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/Schema';
exports['@type'] = 'application/vnd.authnomicon.ac+jwt';
exports['@require'] = [
  './encode',
  './decode'
];
