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
    var prompt = function(){};
    var errorLogging = sinon.spy();
    
    var stub = sinon.stub(server, 'resume').returns([
      function transactionLoader(req, res, next){},
      function resume(req, res, next){}
    ]);
    var handler = factory(server, processTransaction, completeTransaction, prompt, errorLogging);
    
    it('should return handler', function() {
      expect(handler).to.be.an('array');
      expect(handler[1]).to.equal(prompt);
    });
    
    it('should apply resume', function() {
      expect(stub).to.have.been.calledWithExactly(processTransaction, completeTransaction);
    });
  }); // creating handler
  
});
