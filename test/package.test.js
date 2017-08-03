/* global describe, it, expect */

var expect = require('chai').expect;


describe('nodex-aaa-oauth2', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('oauth2');
      
      expect(json.assembly.components).to.have.length(24);
      //expect(json.assembly.components).to.include('main');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
  /*
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
  */
  
});
