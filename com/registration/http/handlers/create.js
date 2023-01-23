// $ curl --header "Content-Type: application/json" --request POST --data '{"client_name":"example"}' http://localhost:3000/oauth2/client

exports = module.exports = function(clients) {
  
  // TODO: Error 5xx not supported if client directory does not have `create()` function
  
  function go(req, res, next) {
    var obj = {
      name: req.body.client_name,
      redirectURIs: req.body.redirect_uris
    }
    
    clients.create(obj, function(err, rec) {
      if (err) { return next(err); }
      
      var obj = {
        client_id: rec.id,
        client_name: rec.name,
        client_secret: rec.secret,
        redirect_uris: rec.redirectURIs
      }
      res.json(obj);
    });
  }
  
  // TODO: authenticate this route?
  return [
    require('body-parser').json(),
    go
  ];
};

exports['@require'] = [
  'http://i.authnomicon.org/oauth2/ClientDirectory'
];
