function SchemeNegotiator() {
  this._schemes = {};
}

SchemeNegotiator.prototype.use = function(scheme, obj) {
  this._schemes[scheme.toLowerCase()] = obj;
};

SchemeNegotiator.prototype.negotiate = function(schemes, options) {
  options = options || {};
  
  var params = {}
    , fmt, type, cap
    , i, len;
  for (i = 0, len = schemes.length; i < len; i++) {
    // WIP
    fmt = formats[i];
    type = fmt.type || fmt
    
    cap = this._formats[type.toLowerCase()];
    if (!cap) { continue; }
    
    params.type = type;
    params.signingAlgorithms = (fmt.signingAlgorithms || []).filter(function(alg) {
      return (cap.signingAlgorithms || []).indexOf(alg) !== -1;
    });
    params.encryptionAlgorithms = (fmt.encryptionAlgorithms || []).filter(function(alg) {
      return (cap.encryptionAlgorithms || []).indexOf(alg) !== -1;
    });
    
    return params;
  }
  
  return null;
}


exports = module.exports = function(container, logger) {
  var negotiator = new SchemeNegotiator();
  
  /*
  var specs = container.specs()
    , spec, obj, type, i, len, j, jlen;
  for (i = 0, len = specs.length; i < len; ++i) {
    spec = specs[i];
    if ((spec.implements || []).indexOf('http://i.bixbyjs.org/tokens/capabilitiesDesc') !== -1) {
      // This specification declares a capabilities descriptor for a particular
      // token type.  Create the descriptor and register it with the
      // `Negotiator` instance.
      obj = container.create(spec.id);
      type = spec.a['@type'];
      if (!Array.isArray(type)) {
        type = [ type ];
      }
      
      for (j = 0, jlen = type.length; j < jlen; ++j) {
        negotiator.use(type[j], obj);
        logger.info('Loaded plug-in declaring capabilities for tokens of type: ' + type[j]);
      }
    }
  }
  */
  
  return negotiator;
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];

exports['@implements'] = 'http://schemas.modulate.io/js/aaa/oauth2/SchemeNegotiator';
