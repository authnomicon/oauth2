/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../com/token/service');


describe('token/http/service', function() {
  
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
