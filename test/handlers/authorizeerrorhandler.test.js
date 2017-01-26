/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/handlers/authorizeerrorhandler');


describe('handlers/authorizeerrorhandler', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var server = {
      authorizationErrorHandler: function(){}
    };
    
    var stub = sinon.stub(server, 'authorizationErrorHandler').returns(function middleware(req, res, next){});
    var handler = factory(server);
    
    it('should invoke Server#authorizationErrorHandler', function() {
      expect(stub).to.have.been.calledOnce;
    });
    
    it('should return route handler', function() {
      expect(handler).to.be.a('function');
    });
  });
  
});
