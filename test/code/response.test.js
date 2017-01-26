/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/code/response');


describe('code/response', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
});
