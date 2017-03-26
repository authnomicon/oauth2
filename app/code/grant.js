exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize');
  
  // TODO: Make modes pluggable
  return oauth2orize.grant.code({
    modes: { // query
      form_post: require('oauth2orize-fprm'),
      web_message: require('oauth2orize-wmrm')
    }
  }, issueCb);
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/grant';
exports['@type'] = 'code';
exports['@require'] = [ './issue/code' ];
