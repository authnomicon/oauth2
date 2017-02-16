exports = module.exports = function() {
  
  // format and structure
  return function negotiateTokenContent(peers) {
    console.log('NEGOTIATE TOKEN FORMAT!');
    console.log(peers);
    
    return {
      type: 'application/jwt',
      dialect: 'urn:ietf:params:oauth:token-type:jwt'
    };
  };
};

exports['@singleton'] = true;
