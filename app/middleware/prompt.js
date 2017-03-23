exports = module.exports = function(flows) {
  
  return function() {
    return function prompt(req, res, next) {
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
    
      flows.goto(prompt, options, req, res, next);
    }
  };
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Dispatcher'
];
