/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/token/http/grant/password');


describe('http/exchange/password/exchange', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/http/Exchange');
    expect(factory['@type']).to.equal('password');
    expect(factory['@singleton']).to.be.undefined;
  });

  describe('creating exchange', function() {
    var passwordSpy = sinon.stub();
    var issue = function(){};
    
    var factory = $require('../../../../app/token/http/grant/password',
      { 'oauth2orize': { exchange: { password: passwordSpy } } });
    var exchange = factory(issue);
    
    it('should create exchange', function() {
      expect(passwordSpy).to.have.been.calledOnce;
      expect(passwordSpy).to.have.been.calledWithExactly(issue);
    });
  });
  
});
