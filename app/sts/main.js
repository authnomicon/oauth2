exports = module.exports = function(issue) {
  var api = {};
  
  api.issue = issue;
  
  return api;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/sts';
exports['@singleton'] = true;
exports['@require'] = [
  './issue'
];
