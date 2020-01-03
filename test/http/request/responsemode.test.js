/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/request/responsemode');


describe('http/handlers/authorize/params/responsemode', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/http/oauth2/RequestParameters');
    expect(factory['@name']).to.equal('response_mode');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
