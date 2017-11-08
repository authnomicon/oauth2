/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/code/grant');


describe('code/grant', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/grantType');
    expect(factory['@type']).to.equal('authorization_code');
  });

  describe('creating grant', function() {
    var codeSpy = sinon.stub();
    var issue = function(){};
    
    var factory = $require('../../app/code/grant',
      { 'oauth2orize': { exchange: { code: codeSpy } } });
    var exchange = factory(issue);
    
    it('should create exchange', function() {
      expect(codeSpy).to.have.been.calledOnce;
      expect(codeSpy).to.have.been.calledWithExactly(issue);
    });
  });
  
});
