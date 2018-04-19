exports = module.exports = function(resume, prompt, exit) {
  
  return {
    resume: resume,
    prompt: prompt,
    exit: exit
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/ceremony/Prompt';
exports['@name'] = 'oauth2/authorize';
exports['@require'] = [
  './authorize/resume',
  './authorize/prompt',
  './authorize/exit'
];
