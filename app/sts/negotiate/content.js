exports = module.exports = function() {
  
  // format and structure
  // TODO: Rename this to confirmation? 
  
  return function negotiateTokenContent(peers, cb) {
    console.log('NEGOTIATE TOKEN FORMAT!');
    console.log(peers);
    
    
    return cb(null, {
      type: 'application/jwt',
      dialect: 'urn:ietf:params:oauth:token-type:jwt',
      signingAlgorithms: [
        'rsa-sha256', 'hmac-sha256'
      ]
    })
  };
};
