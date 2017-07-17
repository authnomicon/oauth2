exports = module.exports = function(Tokens) {
  var oauth2orize = require('oauth2orize');
  
  
  return function() {
    
    return function confirmCrossOrigin(txn, next) {
      console.log('^^^^^^^^^^ CONFIRM CROSS ORIGIN?');
      console.log(txn)
      
      if (txn.user) { return next(); }
      
      var ticket = txn.req.loginTicket;
      if (!ticket) { return next(); }
      
      return next(null, false, { prompt: 'oauth2/crossorigin/initiate-session', ticket: ticket });
      
      
      
      Tokens.decipher(ticket, { dialect: 'http://schemas.authnomicon.org/tokens/jwt/login-ticket' }, function(err, claims) {
        if (err) { return next(err); }
      
        console.log(claims);
        
        
        var confirmation = claims.confirmation || []
          , conf;
          
          if (confirmation.length == 0) {
            // TODO: error, unable to confirm
          }
          
        return next(null, false, { prompt: 'oauth2/crossorigin/initiate-session', ticket: ticket, confirmation: confirmation });
          
        // TODO: Sort the confirmation claims by preferred order...

        for (i = 0, len = confirmation.length; i < len; ++i) {
          conf = confirmation[i];
      
          console.log('CHECK THIS:');
          console.log(conf)
      
      
          switch (conf.method) {
          case 'pkco':
            return next(null, false, { prompt: 'oauth2/crossorigin/initiate-session', ticket: ticket, confirmation: confirmation });
          default:
            // TODO: HTTP errors
            return next(new Error('Unsupported confirmation method: ' + conf.name));
          }
        }
      });
    };
  };
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/middleware/crossorigin';
exports['@require'] = [
  'http://i.bixbyjs.org/tokens'
]