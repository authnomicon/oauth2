var TYPE_2_TYPE_DIALECT = {
  access_token: [ 'application/jwt', 'application/at+jwt' ],
  refresh_token: [ 'application/jwt', 'application/vnd.authnomicon.rt+jwt' ],
  authorization_code: [ 'application/jwt', 'application/vnd.authnomicon.ac+jwt' ],
};


exports = module.exports = function(tokens) {
  var svc = {};
  
  svc.issue = function(msg, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options == undefined;
    } else if (typeof options == 'string') {
      options = { type: options };
    }
    options = options || {};
    
    
    var typed = TYPE_2_TYPE_DIALECT[options.type]
      , dialect = typed ? typed[1] : options.dialect
      , sz;
    
    try {
      sz = tokens.createSerializer(dialect);
    } catch (ex) {
      return cb(ex);
    }
    
    sz.serialize(msg, function(err, claims) {
      var type = typed ? typed[0] : (options.type || 'application/jwt')
        , sl;
      try {
        sl = tokens.createSealer(type);
      } catch (ex) {
        return cb(ex);
      }
      
      /*
      var recipients = [ {
            id: 'AS1AC',
            identifier: 'http://localhost/authorization_code',
            secret: 'some-secret-shared-with-oauth-authorization-server'
          } ];
      */
      
      var recipients = undefined;
      
      sl.seal(claims, recipients, { confidential: false }, function(err, token) {
        if (err) { return cb(err); }
        return cb(null, token);
      });
    });
  }
  
  svc.verify = function(token, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options == undefined;
    } else if (typeof options == 'string') {
      options = { type: options };
    }
    options = options || {};
    
    
    var unsealer;
    try {
      unsealer = tokens.createUnsealer();
    } catch (ex) {
      return cb(ex);
    }
    
    unsealer.unseal(token, options, function(err, claims, conditions, issuer) {
      var dialect;
      try {
        dialect = tokens.createDeserializer();
      } catch (ex) {
        return cb(ex);
      }
      
      dialect.deserialize(claims, function(err, msg) {
        if (err) { return cb(err); }
        return cb(null, msg);
      });
    });
    
  }
  
  return svc;
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/SecurityTokenService';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/tokens'
];
