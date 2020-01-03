/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var factory = require('../../../../../app/authorize/http/response/modes/formpost');


describe('authorize/http/response/modes/formpost', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorize/http/ResponseMode');
    expect(factory['@mode']).to.equal('form_post');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct mode', function() {
    var mode = factory();
    expect(mode).to.be.a('function');
  });
  
});
