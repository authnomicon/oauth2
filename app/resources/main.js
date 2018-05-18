exports = module.exports = function(infer) {
  var api = {};
  
  api.infer = infer;
  
  return api;
};

exports['@singleton'] = true;
exports['@require'] = [
  './infer'
];
