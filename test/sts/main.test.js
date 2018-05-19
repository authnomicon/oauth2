/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../app/sts/main');


describe('sts/main', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/sts');
    expect(factory['@singleton']).to.be.true;
  });
  
});
