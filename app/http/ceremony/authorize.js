exports = module.exports = function(resume, finish) {
  
  return {
    resume: resume,
    finish: finish
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/ceremony/Prompt';
exports['@name'] = 'oauth2/authorize';
exports['@require'] = [
  './authorize/resume',
  './authorize/finish'
];
