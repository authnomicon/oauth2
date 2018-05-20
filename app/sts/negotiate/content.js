exports = module.exports = function() {
  
  // format and structure
  // TODO: Rename this to confirmation?
  
  return function negotiateTokenContent(peers) {
    console.log('NEGOTIATE TOKEN FORMAT!');
    console.log(peers);
    
    return {
      type: 'application/jwt',
      dialect: 'urn:ietf:params:oauth:token-type:jwt',
      signingAlgorithms: [
        'rsa-sha256', 'hmac-sha256'
      ]
    };
  };
};

exports['@singleton'] = true;
