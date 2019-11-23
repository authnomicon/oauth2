exports = module.exports = function() {
  var oauth2orize = require('oauth2orize');


  function prompt(req, res, next) {
    
    console.log('CONTINUE OAUTH2 CEREMONY PROMPT??');
    console.log(req.oauth2)
    console.log(req.state);
    //res.prompt('login', { maxAttempts: 3 });
    
    //req.state.foo = 'bar'; // TODO: force save
    
    //res.redirect('/login/password');
    
    //return;
    
    
    /*
    var areq = req.oauth2.req
      , prompt = req.oauth2.info.prompt
      , options = req.oauth2.info
      , error = 'interaction_required';
  
    //res.prompt('login');
    
    //res.prompt(prompt, options);
    //res.redirect('/login/password');
    
    return;
    */
    
    var areq = req.oauth2.req
      , prompt = req.oauth2.info.prompt
      , options = req.oauth2.info
      , error = 'interaction_required';
  
    if (areq.prompt && areq.prompt.indexOf('none') !== -1) {
      switch (prompt) {
      case 'login':
        error = 'login_required';
        break;
      case 'consent':
        error = 'consent_required';
        break;
        // TODO: Account selection
      }
  
      return next(new oauth2orize.AuthorizationError('Interaction with user is required to proceed', error, null, 403));
    }

    delete options.prompt;
    switch (prompt) {
    case 'consent':
      options.client = req.oauth2.client;
      // TODO: Add audience
      break;
    }

    console.log('PROMPTING HERE 1...');
    console.log(req.state);
    res.prompt(prompt, options);
  }


  return [
    prompt
  ];
};

exports['@require'] = [];
