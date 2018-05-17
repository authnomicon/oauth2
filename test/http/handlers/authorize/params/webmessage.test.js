/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../app/http/handlers/authorize/params/webmessage');


describe('http/handlers/authorize/params/webmessage', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/http/oauth2/RequestParameters');
    expect(factory['@name']).to.equal('web_message_uri');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
