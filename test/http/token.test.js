/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../app/http/token');


describe('http/token', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal([
      'http://i.bixbyjs.org/http/Service',
      'http://schemas.authnomicon.org/js/http/oauth2/TokenService'
    ]);
    expect(factory['@path']).to.equal('/oauth2/token');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
