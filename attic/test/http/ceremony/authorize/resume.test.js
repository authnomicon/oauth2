/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/ceremony/authorize/resume');
var oauth2orize = require('oauth2orize');


describe('http/ceremony/authorize/resume', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var server = {
      resume: function(){
        return function(req, res, next) {
          next();
        };
      }
    }
    function processTransaction() {};
    function completeTransaction() {};
    
    
    describe('default behavior', function() {
      var request, response, prompt;
      
      before(function() {
        sinon.spy(server, 'resume');
      });
      
      after(function() {
        server.resume.restore();
      });
      
      before(function(done) {
        var handler = factory(processTransaction, completeTransaction, server);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
          })
          .res(function(res) {
            response = res;
            res.prompt = function(p) {
              prompt = p;
              this.end();
            }
          })
          .end(function(res) {
            done();
          })
          .dispatch();
      });
      
      it('should add resume middleware to stack', function() {
        expect(server.resume.callCount).to.equal(1);
        expect(server.resume).to.be.calledWithExactly(processTransaction, completeTransaction);
      });
      
      it('should prompt', function() {
        expect(prompt).to.be.undefined;
      });
    }); // default behavior
    
  });
  
});
