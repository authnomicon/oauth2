/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/handlers/authorize/completetransaction');
var EventEmitter = require('events').EventEmitter;


describe('http/handlers/authorize/completetransaction', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/oauth2/http/authorize/completeTransactionFunc');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
