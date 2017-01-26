/* global describe, it, expect */

var expect = require('chai').expect;
var source = require('..');


describe('nodex-aaa-oauth2', function() {
  
  it('should export manifest', function() {
    expect(source).to.be.an('object');
    expect(source['server']).to.be.a('function');
    expect(source['transactionstore']).to.be.a('function');
    expect(source['response/code']).to.be.a('function');
    expect(source['token/response']).to.be.a('function');
    expect(source['exchange/authorizationcode']).to.be.a('function');
  });
  
  describe('oauth2/response/code', function() {
    var response = source['response/code'];
    
    it('should be annotated', function() {
      expect(response['@implements']).to.equal('http://schema.modulate.io/js/aaa/oauth2/Response');
      expect(response['@type']).to.equal('code');
      expect(response['@singleton']).to.equal(undefined);
    });
  });
  
});
