exports = module.exports = function() {
  
  function revoke(req, res, next) {
    console.log('TODO: revoke token');
    res.end();
  }


  return [
    revoke
  ];
};

exports['@require'] = [
];
