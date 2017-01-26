/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../lib/handlers/resume');


describe('handlers/resume', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var server = {
      resume: function(){}
    };
    var immediateResponseCb = function(){};
    
    var stub = sinon.stub(server, 'resume').returns([
      function middleware1(req, res, next){},
      function middleware2(req, res, next){}
    ]);
    var handler = factory(server, immediateResponseCb);
    
    it('should invoke Server#resume with callback', function() {
      expect(stub).to.have.been.calledWithExactly(immediateResponseCb);
    });
    
    it('should return route handler', function() {
      expect(handler).to.be.an('array');
    });
  });
  
});
