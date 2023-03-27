/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../com/revoke/service');


describe('revoke/service', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/oauth2/revoke');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct service', function() {
    function revokeHandler() {};
  
    var service = factory(revokeHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
  });
  
});
