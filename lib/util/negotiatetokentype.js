exports = module.exports = function() {
  
  // aka, method of utilization
  return function negotiateTokenType(client, resources) {
    console.log('NEGOTIATE TOKEN TYPE!');
    console.log(client);
    console.log(resources)
    
    return { type: 'bearer' };
  };
};

exports['@singleton'] = true;
