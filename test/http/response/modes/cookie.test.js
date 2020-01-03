/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var factory = require('../../../../app/http/response/modes/cookie');


describe('http/response/modes/cookie', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/http/oauth2/ResponseMode');
    expect(factory['@mode']).to.equal('cookie');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct mode', function() {
    var mode = factory();
    expect(mode).to.be.a('function');
  });
  
});
