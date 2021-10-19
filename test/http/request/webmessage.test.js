/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/http/request/webmessage');


describe('http/request/webmessage', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/RequestParameters');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('creating extensions', function() {
    var extensionsSpy = sinon.stub();
    
    var factory = $require('../../../com/http/request/webmessage',
      { 'oauth2orize-wmrm': { extensions: extensionsSpy } });
    var extensions = factory();
    
    it('should create extensions', function() {
      expect(extensionsSpy).to.have.been.calledOnce;
    });
  });
  
});
