/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../../app/tokens/authorization-code/jwt/schema');


describe('tokens/authorization-code/jwt/schema', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/tokens/Dialect');
    expect(factory['@type']).to.equal('application/vnd.authnomicon.ac+jwt');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
