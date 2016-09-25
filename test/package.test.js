/* global describe, it, expect */

var expect = require('chai').expect;
var source = require('..');


describe('nodex-aaa-oauth2', function() {
  
  it('should export manifest', function() {
    expect(source).to.be.an('object');
    expect(source['server']).to.be.a('function');
    expect(source['transactionstore']).to.be.a('function');
    expect(source['response/code']).to.be.a('function');
    expect(source['response/token']).to.be.a('function');
    expect(source['exchange/authorizationcode']).to.be.a('function');
  });
  
});
