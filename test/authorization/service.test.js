/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../com/authorization/service');


describe('authorize/http/service', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/oauth2/authorize');
    expect(factory['@relation']).to.equal('oauth2-authorize');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct service', function() {
    function authorizeHandler() {};
    function continueHandler() {};
  
    var service = factory(authorizeHandler, continueHandler);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
  });
  
});
