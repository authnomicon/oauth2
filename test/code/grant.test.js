/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/code/grant');


describe('code/grant', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schema.modulate.io/js/aaa/oauth2/exchange');
    expect(factory['@type']).to.equal('authorization_code');
    expect(factory['@singleton']).to.be.undefined;
  });

  describe('factory', function() {
    var issueCb = function(){};
    
    var spy = sinon.spy(function(){ return function(req, res, next){} });
    var factory = $require('../../lib/code/grant',
      { 'oauth2orize': { exchange: { code: spy } } });
    var exchange = factory(issueCb);
    
    it('should invoke Server#authorization with callbacks', function() {
      expect(spy).to.have.been.calledWithExactly(issueCb);
    });
    
    it('should return exchange', function() {
      expect(exchange).to.be.a('function');
    });
  });

});
