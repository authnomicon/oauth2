exports.wrapBasic = function(verify, method) {
  return function wrapVerify(clientID, secret, cb) {
    verify(clientID, secret, function(err, client, info) {
      if (err) { return cb(err); }
      if (!client) { return cb(err, client); }
      info = info || {};
      info.oauth2 = info.oauth2 || {};
      info.oauth2.method = method;
      return cb(err, client, info);
    });
  };
};
