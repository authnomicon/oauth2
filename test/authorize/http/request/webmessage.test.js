/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/request/webmessage');


describe('authorize/http/request/webmessage', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/RequestParameters');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should create extension', function() {
    var extensionsSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/request/webmessage', {
      'oauth2orize-wmrm': { extensions: extensionsSpy }
    });
    
    var extensions = factory();
    expect(extensionsSpy).to.have.been.calledOnce;
  }); // should create extension
  
});
