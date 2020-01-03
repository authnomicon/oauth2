var expect = require('chai').expect;
var factory = require('../../app/http/server');


describe('http/server', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.equal(true);
  });
  
});
