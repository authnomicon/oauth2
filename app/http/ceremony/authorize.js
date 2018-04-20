exports = module.exports = function(prompt, resume, exit) {
  
  return {
    prompt: prompt,
    resume: resume,
    exit: exit
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/ceremony/Prompt';
exports['@name'] = 'oauth2/authorize';
exports['@require'] = [
  './authorize/prompt',
  './authorize/resume',
  './authorize/exit'
];
