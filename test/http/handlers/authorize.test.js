/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/handlers/authorize');


describe('http/handlers/authorize', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('creating handler', function() {
    var server = {
      authorization: function(){},
      authorizationErrorHandler: function(){}
    };
    var validateClient = function(){};
    var processTransaction = function(){};
    var completeTransaction = function(){};
    
    var authenticate = function(){};
    var authorization = function(){};
    var prompt = function(){};
    var errorLogging = function(){};
    var errorHandler = function(){};
    
    
    var authenticateStub = sinon.stub().returns(authenticate);
    var authorizationStub = sinon.stub(server, 'authorization').returns(authorization);
    var errorLoggingStub = sinon.stub().returns(errorLogging);
    var errorHandlerStub = sinon.stub(server, 'authorizationErrorHandler').returns(errorHandler);
    
    var handler = factory(server, validateClient, processTransaction, completeTransaction, prompt, authenticateStub, errorLoggingStub);
    
    it('should return handler', function() {
      expect(handler).to.be.an('array');
      expect(handler[0]).to.equal(authenticate);
      expect(handler[1]).to.equal(authorization);
      expect(handler[2]).to.equal(prompt);
      expect(handler[3]).to.equal(errorLogging);
      expect(handler[4]).to.equal(errorHandler);
    });
    
    it('should apply authenticate', function() {
      expect(authenticateStub).to.have.been.calledWithExactly([ 'session', 'anonymous' ]);
    });
    
    it('should apply authorization', function() {
      expect(authorizationStub).to.have.been.calledWithExactly(validateClient, processTransaction, completeTransaction);
    });
    
    it('should apply error handler', function() {
      expect(errorHandlerStub).to.have.been.calledOnce;
    });
  });
  
});
