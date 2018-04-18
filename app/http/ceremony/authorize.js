exports = module.exports = function(resume) {
  
  return {
    launch: null,
    resume: resume
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/ceremony/Prompt';
exports['@name'] = 'oauth2-authorize';
exports['@require'] = [
  './authorize/resume'
];
