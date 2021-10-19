/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var factory = require('../../../../../com/authorize/http/response/modes/webmessage');


describe('http/authorize/response/modes/webmessage', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode');
    expect(factory['@mode']).to.equal('web_message');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct mode', function() {
    var mode = factory();
    expect(mode).to.be.a('function');
  });
  
});
