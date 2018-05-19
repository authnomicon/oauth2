exports = module.exports = function() {
  
  // aka, method of utilization
  return function negotiateTokenType(client, resources, cb) {
    console.log('NEGOTIATE TOKEN TYPE!');
    console.log(client);
    console.log(resources)
    
    return cb(null, 'bearer');
    
    return { type: 'bearer' };
  };
};
