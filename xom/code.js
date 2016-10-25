exports = module.exports = function(codec) {
  var api = {};
  
  api.encode = function(data, cb) {
    codec.encode(data, cb);
  }
  
  api.decode = function(code, cb) {
    codec.decode(code, cb);
  }
  
  return api;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/code';
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/code/Codec'
];
