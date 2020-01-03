/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/request/responsemode');


describe('http/request/responsemode', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/http/oauth2/RequestParameters');
    expect(factory['@name']).to.equal('response_mode');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('creating extensions', function() {
    var extensionsSpy = sinon.stub();
    
    var factory = $require('../../../app/http/request/responsemode',
      { 'oauth2orize-response-mode': { extensions: extensionsSpy } });
    var extensions = factory();
    
    it('should create extensions', function() {
      expect(extensionsSpy).to.have.been.calledOnce;
    });
  });
  
});
