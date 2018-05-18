/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../app/tokens/code/schema');


describe('tokens/code/schema', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/security/tokens/Schema');
    expect(factory['@type']).to.equal('urn:ietf:params:oauth:token-type:authorization_code');
    expect(factory['@schema']).to.equal('urn:ietf:params:oauth:token-type:jwt');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
