exports = module.exports = function(infer) {
  var api = {};
  
  api.infer = infer;
  
  return api;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/resources';
exports['@singleton'] = true;
exports['@require'] = [
  './infer'
];
