exports = module.exports = function(resume, process, finish) {
  
  return {
    resume: resume,
    process: process,
    exit: finish
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/ceremony/Prompt';
exports['@name'] = 'oauth2/authorize';
exports['@require'] = [
  './authorize/resume',
  './authorize/process',
  './authorize/finish'
];
