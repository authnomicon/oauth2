/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/response/code');


describe('response/code', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
});
