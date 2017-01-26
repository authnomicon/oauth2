exports = module.exports = function(resume) {
  
  return {
    begin: null,
    resume: resume
  };
};

exports['@require'] = [
  './authorize/resume'
];
