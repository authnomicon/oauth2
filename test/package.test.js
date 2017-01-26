/* global describe, it, expect */

var expect = require('chai').expect;
var source = require('..');


describe('nodex-aaa-oauth2', function() {
  
  it('should export manifest', function() {
    expect(source).to.be.an('object');
    expect(source['server']).to.be.a('function');
    expect(source['transactionstore']).to.be.a('function');
    expect(source['code/response']).to.be.a('function');
    expect(source['code/grant']).to.be.a('function');
    expect(source['token/response']).to.be.a('function');
  });
  
  describe('oauth2/code/response', function() {
    var response = source['code/response'];
    
    it('should be annotated', function() {
      expect(response['@implements']).to.equal('http://schema.modulate.io/js/aaa/oauth2/Response');
      expect(response['@type']).to.equal('code');
      expect(response['@singleton']).to.equal(undefined);
    });
  });
  
});
