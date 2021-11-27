/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/token/http/handlers/token');


describe('token/http/handlers/token', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var container = {
      create: function(){}
    }
    var logger = {
      notice: function(){}
    }
    
    var server = {
      token: function(){
        return function(req, res, next) {
          res.end();
        };
      },
      errorHandler: function(){
        return function(err, req, res, next) {
          next(err);
        };
      }
    }
    
    function parse() {
      return function(req, res, next) {
        next();
      };
    }
    
    function authenticate(schemes) {
      return function(req, res, next) {
        req.authInfo = { schemes: schemes };
        next();
      };
    }
    
    function errorLogging() {
      return function(err, req, res, next) {
        next(err);
      };
    }
    
    
    describe('default behavior', function() {
      var request, response;
      var parseSpy = sinon.spy(parse);
      
      before(function() {
        sinon.stub(container, 'create').returns(Promise.reject(new Error('component not found')));
      });
      
      /*
      after(function() {
        container.create.restore();
      });
      */
      
      before(function(done) {
        var promise = factory(container, server, parseSpy, authenticate, errorLogging, logger);
        promise.then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              request = req;
              response = res;
            })
            .finish(function() {
              done();
            })
            .next(function(err) {
              console.log('next')
              console.log(err)
            })
            .listen();
        });
      });
      
      it('should add parse middleware to stack', function() {
        expect(parseSpy.callCount).to.equal(1);
        expect(parseSpy).to.be.calledWithExactly('application/x-www-form-urlencoded');
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          schemes: [
            'oauth2-client-authentication/client_secret_basic',
            'oauth2-client-authentication/client_secret_post',
            'oauth2-client-authentication/none'
          ]
        });
      });
      
      it('should end', function() {
        expect(response.statusCode).to.equal(200);
      });
    }); // default behavior
    
  }); // handler
  
});
