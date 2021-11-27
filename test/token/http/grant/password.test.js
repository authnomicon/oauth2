/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/token/http/grant/password');


describe('token/http/grant/password', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/token/http/AuthorizationGrantExchange');
    expect(factory['@type']).to.equal('password');
    expect(factory['@singleton']).to.be.undefined;
  });

  describe('creating exchange', function() {
    var passwordSpy = sinon.stub();
    var issue = function(){};
    
    var factory = $require('../../../../com/token/http/grant/password',
      { 'oauth2orize': { exchange: { password: passwordSpy } } });
    var exchange = factory(issue);
    
    it('should create exchange', function() {
      expect(passwordSpy).to.have.been.calledOnce;
      //expect(passwordSpy).to.have.been.calledWithExactly(issue);
    });
  });
  
});
