/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/token/http/grant/code');


describe('token/http/grant/code', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/http/Exchange');
    expect(factory['@type']).to.equal('authorization_code');
    expect(factory['@singleton']).to.be.undefined;
  });

  describe('creating exchange', function() {
    
    var codeSpy = sinon.stub();
    var issue = function(){};
    
    var factory = $require('../../../../app/token/http/grant/code',
      { 'oauth2orize': { exchange: { code: codeSpy } } });
    var exchange = factory(issue);
    
    it('should create exchange', function() {
      expect(codeSpy.callCount).to.equal(1);
      expect(codeSpy.args[0][0]).to.be.a('function');
    });
  });
  
});
