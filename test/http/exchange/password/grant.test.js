/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/exchange/password/grant');


describe('password/grant', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/grantType');
    expect(factory['@type']).to.equal('password');
  });

  describe('creating grant', function() {
    var passwordSpy = sinon.stub();
    var issue = function(){};
    
    var factory = $require('../../../../app/http/exchange/password/grant',
      { 'oauth2orize': { exchange: { password: passwordSpy } } });
    var exchange = factory(issue);
    
    it('should create exchange', function() {
      expect(passwordSpy).to.have.been.calledOnce;
      expect(passwordSpy).to.have.been.calledWithExactly(issue);
    });
  });
  
});
