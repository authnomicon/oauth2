/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/grant/token/grant');


describe('token/response', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
});
