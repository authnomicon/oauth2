/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/authorization/request/responsemode');


describe('authorize/http/request/responsemode', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.RequestParametersProcessor');
  });
  
  it('should create processor', function() {
    var extensionsSpy = sinon.stub();
    var factory = $require('../../../com/authorization/request/responsemode', {
      'oauth2orize-response-mode': { extensions: extensionsSpy }
    });
    
    var extensions = factory();
    expect(extensionsSpy).to.have.been.calledOnce;
  }); // should create processor
  
});
