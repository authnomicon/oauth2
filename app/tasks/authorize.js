exports = module.exports = function(resume) {
  
  return {
    begin: null,
    resume: resume
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/flows/Task';
exports['@name'] = 'oauth2-authorize';
exports['@require'] = [
  './authorize/resume'
];
