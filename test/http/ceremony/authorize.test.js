/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../app/http/ceremony/authorize');


describe('http/ceremony/authorize', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/ceremony/Prompt2');
    expect(factory['@name']).to.equal('/oauth2/authorize');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
