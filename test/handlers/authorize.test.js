/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../xom/handlers/authorize');


describe('handlers/authorize', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var server = {
      authorization: function(){}
    };
    var validateRequestCb = function(){};
    var immediateResponseCb = function(){};
    
    var stub = sinon.stub(server, 'authorization').returns(function middleware(req, res, next){});
    var handler = factory(server, validateRequestCb, immediateResponseCb);
    
    it('should invoke Server#authorization with callbacks', function() {
      expect(stub).to.have.been.calledWithExactly(validateRequestCb, immediateResponseCb);
    });
    
    it('should return route handler', function() {
      expect(handler).to.be.a('function');
    });
  });
  
});
