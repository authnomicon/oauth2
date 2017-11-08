/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/handlers/token');


describe('http/handlers/token', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('creating handler', function() {
    var server = {
      token: function(){},
      errorHandler: function(){}
    };
    var logger = {
      notice: function(){}
    };
    
    var parse = function(){};
    var authenticate = function(){};
    var token = function(){};
    var errorLogging = function(){};
    var errorHandler = function(){};
    
    
    describe('without multi-factor support', function() {
      var parseStub = sinon.stub().returns(parse);
      var authenticateStub = sinon.stub().returns(authenticate);
      var tokenStub = sinon.stub(server, 'token').returns(token);
      var errorLoggingStub = sinon.stub().returns(errorLogging);
      var errorHandlerStub = sinon.stub(server, 'errorHandler').returns(errorHandler);
    
      var handler;
      before(function(done) {
        var container = {
          create: function(){}
        }
        sinon.stub(container, 'create').returns(Promise.reject(new Error('component not found')));
      
        var promise = factory(container, server, parseStub, authenticateStub, errorLoggingStub, logger);
        promise.then(function(h) {
          handler = h;
          done();
        });
      });
    
      it('should return handler', function() {
        expect(handler).to.be.an('array');
        expect(handler[0]).to.equal(parse);
        expect(handler[1]).to.equal(authenticate);
        expect(handler[2]).to.equal(token );
        expect(handler[3]).to.equal(errorLogging);
        expect(handler[4]).to.equal(errorHandler);
      });
    
      it('should apply parse', function() {
        expect(parseStub).to.have.been.calledWithExactly('application/x-www-form-urlencoded');
      });
    
      it('should apply authenticate', function() {
        expect(authenticateStub).to.have.been.calledWithExactly([ 'client_secret_basic', 'client_secret_post', 'none' ]);
      });
    }); // without multi-factor support
    
  }); // creating handler
  
});
