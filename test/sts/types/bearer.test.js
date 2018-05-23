/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/sts/types/bearer');


describe('sts/types/bearer', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('format', function() {
    
    describe('a bearer token', function() {
      var attrs = factory()({});
      
      it('should supply attributes', function() {
        expect(attrs).to.deep.equal({
          token_type: 'Bearer'
        });
      });
    }); // a bearer token
    
    describe('a proof of possession token', function() {
      var attrs = factory()({ key: 'adijq39jdlaska9asud' });
      
      it('should not supply attributes', function() {
        expect(attrs).to.be.undefined;
      });
    }); // a proof of possession token
    
  }); // format
  
});
