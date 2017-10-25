/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/handlers/authorize');


describe('handlers/authorize', function() {
  
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
    var prompt = function(){};
    var authenticate = sinon.spy();
    var errorLogging = sinon.spy();
    
    var server_authorizationStub = sinon.stub(server, 'authorization').returns(
      function authorization(req, res, next){}
    );
    var server_authorizationErrorHandlerStub = sinon.stub(server, 'authorizationErrorHandler').returns([
      function transactionLoader(err, req, res, next){},
      function authorization(err, req, res, next){}
    ]);
    var handler = factory(server, validateClient, processTransaction, completeTransaction, prompt, authenticate, errorLogging);
    
    it('should return handler', function() {
      expect(handler).to.be.an('array');
      expect(handler[2]).to.equal(prompt);
    });
    
    it('should apply authenticate', function() {
      expect(authenticate).to.have.been.calledWithExactly([ 'session', 'anonymous' ]);
    });
    
    it('should apply authorization', function() {
      expect(server_authorizationStub).to.have.been.calledWithExactly(validateClient, processTransaction, completeTransaction);
    });
    
    it('should apply authorization error handler', function() {
      expect(server_authorizationStub).to.have.been.calledOnce;
    });
  });
  
});
