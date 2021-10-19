/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../com/token/http/service');


describe('http/token/service', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@type']).to.equal('oauth2-token');
    expect(factory['@path']).to.equal('/oauth2/token');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct service', function() {
    function tokenHandler() {};
  
    var service = factory(tokenHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
  });
  
});
