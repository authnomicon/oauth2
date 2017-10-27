/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/workflow/authorize/resume');


describe('http/workflow/authorize/resume', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('creating handler', function() {
    var server = {
      resume: function(){},
      authorizationErrorHandler: function(){}
    };
    var processTransaction = function(){};
    var completeTransaction = function(){};
    
    var resume = function(){};
    var prompt = function(){};
    var errorLogging = function(){};
    var errorHandler = function(){};
    
    
    var resumeStub = sinon.stub(server, 'resume').returns(resume);
    var promptStub = sinon.stub().returns(prompt);
    var errorLoggingStub = sinon.stub().returns(errorLogging);
    var errorHandlerStub = sinon.stub(server, 'authorizationErrorHandler').returns(errorHandler);
    
    var handler = factory(server, processTransaction, completeTransaction, promptStub, errorLoggingStub);
    
    it('should return handler', function() {
      expect(handler).to.be.an('array');
      expect(handler[0]).to.equal(resume);
      expect(handler[1]).to.equal(prompt);
      expect(handler[2]).to.equal(errorLogging);
      expect(handler[3]).to.equal(errorHandler);
    });
    
    it('should apply resume', function() {
      expect(resumeStub).to.have.been.calledWithExactly(processTransaction, completeTransaction);
    });
    
    it('should apply error logging', function() {
      expect(errorLoggingStub).to.have.been.calledOnce;
    });
    
    it('should apply error handler', function() {
      expect(errorHandlerStub).to.have.been.calledOnce;
    });
  }); // creating handler
  
});
