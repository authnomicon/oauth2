exports = module.exports = function() {
  
  return function bearer(params) {
    if (Object.keys(params).length !== 0) { return; }
    return { token_type: 'Bearer' };
  };
};
