/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../xom/handlers/token');


describe('handlers/token', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var server = {
      token: function(){}
    };
    var immediateResponseCb = function(){};
    
    var stub = sinon.stub(server, 'token').returns(function middleware(req, res, next){});
    var handler = factory(server);
    
    it('should invoke Server#token', function() {
      expect(stub).to.have.been.calledOnce;
    });
    
    it('should return route handler', function() {
      expect(handler).to.be.a('function');
    });
  });
  
});
