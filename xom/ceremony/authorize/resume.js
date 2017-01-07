exports = module.exports = function(resume, errorHandler, ceremony) {
  
  function prompt(req, res, next) {
    var prompt = req.oauth2.info.prompt;
    var options = req.oauth2.info;
    delete options.prompt;
    options.state = req.oauth2.transactionID;
    
    switch (prompt) {
    case 'consent':
      options.clientID = req.oauth2.client.id;
      // TODO: Add audience
      break;
    }
    
    ceremony.goto(prompt, options, req, res, next);
  }


  return [
    resume,
    prompt,
    errorHandler
  ];
  
};

exports['@require'] = [
  '../../handlers/resume',
  '../../handlers/authorizeErrorHandler',
  'http://i.bixbyjs.org/www/ceremony/Dispatcher'
];
