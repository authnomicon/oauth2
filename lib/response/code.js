exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize');
  
  // TODO: Make modes pluggable
  return oauth2orize.grant.code({
    modes: {
      form_post: require('oauth2orize-fprm'),
      web_message: require('oauth2orize-wmrm')
    }
  }, issueCb);
};

exports['@require'] = [ './_code/issuecb' ];
exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/Response';
